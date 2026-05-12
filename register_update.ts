import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
)

serve(async (req) => {
  try {
    const { username, password, phone, referral } = await req.json()

    if (!username || !password || !phone) {
      return new Response(JSON.stringify({ success: false, error: "Missing fields" }), {
        headers: { "Content-Type": "application/json" }, status: 200
      })
    }

    const { data: existingUser } = await supabaseAdmin
      .from("users").select("id").eq("username", username.toUpperCase()).single()

    if (existingUser) {
      return new Response(JSON.stringify({ success: false, error: "Username already taken" }), {
        headers: { "Content-Type": "application/json" }, status: 200
      })
    }

    const email = `${username.toUpperCase()}@novabett.internal`

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { username: username.toUpperCase() }
    })

    if (authError) {
      return new Response(JSON.stringify({ success: false, error: authError.message }), {
        headers: { "Content-Type": "application/json" }, status: 200
      })
    }

    const userId = authUser.user.id

    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        id: userId,
        username: username.toUpperCase(),
        phone: phone,
        total_deposit: 0,
        vip_level: 1,
        first_deposit_claimed: false
      })

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return new Response(JSON.stringify({ success: false, error: insertError.message }), {
        headers: { "Content-Type": "application/json" }, status: 200
      })
    }

    await supabaseAdmin.from("wallets").insert({
      user_id: userId, main_balance: 0, bonus_balance: 0
    })

    if (referral) {
      const { data: referrer } = await supabaseAdmin
        .from("users").select("id").eq("username", referral.toUpperCase()).single()

      if (referrer) {
        const { data: ancestors } = await supabaseAdmin
          .from("affiliate_tree").select("ancestor_id, level").eq("descendant_id", referrer.id)

        const treeInserts = ancestors.map(a => ({
          ancestor_id: a.ancestor_id,
          descendant_id: userId,
          level: a.level + 1
        }))
        treeInserts.push({ ancestor_id: referrer.id, descendant_id: userId, level: 1 })
        treeInserts.push({ ancestor_id: userId, descendant_id: userId, level: 0 })

        await supabaseAdmin.from("affiliate_tree").insert(treeInserts)
      } else {
        await supabaseAdmin.from("affiliate_tree").insert({
          ancestor_id: userId, descendant_id: userId, level: 0
        })
      }
    } else {
      await supabaseAdmin.from("affiliate_tree").insert({
        ancestor_id: userId, descendant_id: userId, level: 0
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }, status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "Content-Type": "application/json" }, status: 200
    })
  }
})
