import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Authorization, apikey, Content-Type, x-admin-key'
      }
    })
  }

  try {
    const adminKey = req.headers.get('x-admin-key')
    if (adminKey !== Deno.env.get('ADMIN_SECRET')) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 200
      })
    }

    const { transactionId, action } = await req.json()
    if (!transactionId || !action) throw new Error("Missing fields")

    const { data: tx, error: fetchErr } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()
    if (fetchErr || !tx) throw new Error("Transaction not found")
    if (tx.status !== 'pending') throw new Error("Already processed")

    if (action === 'approve') {
      const { data: wallet, error: walletErr } = await supabaseAdmin
        .from('wallets')
        .select('main_balance')
        .eq('user_id', tx.user_id)
        .maybeSingle()
      if (walletErr) throw new Error("Wallet check failed: " + walletErr.message)

      if (!wallet) {
        const { error: insertErr } = await supabaseAdmin
          .from('wallets')
          .insert({ user_id: tx.user_id, main_balance: 0, bonus_balance: 0 })
        if (insertErr) throw new Error("Wallet creation failed: " + insertErr.message)
      }

      const { data: freshWallet, error: refetchErr } = await supabaseAdmin
        .from('wallets')
        .select('main_balance')
        .eq('user_id', tx.user_id)
        .single()
      if (refetchErr || !freshWallet) throw new Error("Failed to refetch wallet")

      const currentBalance = Number(freshWallet.main_balance)
      const amount = Number(tx.amount)
      const newBalance = tx.type === 'deposit' ? currentBalance + amount : currentBalance - amount

      const { error: updateErr } = await supabaseAdmin
        .from('wallets')
        .update({ main_balance: newBalance })
        .eq('user_id', tx.user_id)
      if (updateErr) throw new Error("Balance update failed: " + updateErr.message)

      await supabaseAdmin.from('transactions').update({ status: 'confirmed' }).eq('id', transactionId)
    } else if (action === 'reject') {
      await supabaseAdmin.from('transactions').update({ status: 'rejected' }).eq('id', transactionId)
    } else {
      throw new Error("Invalid action")
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200
    })
  }
})
