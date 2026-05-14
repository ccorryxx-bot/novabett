<template>
  <!-- ... template same as previous Dark Teal design ... -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import DepositModal from '@/components/DepositModal.vue'
import WithdrawModal from '@/components/WithdrawModal.vue'

const route = useRoute()
const { locale } = useI18n()
const currentLang = ref(locale.value)
const toggleLanguage = () => { /* ... same ... */ }

// Auth state
const isLoggedIn = ref(false)
const username = ref('')
const mainBalance = ref(0)
const balanceLoading = ref(false)

// Avatar random colors (unchanged)
// ...

// Auth modal
const showAuthModal = ref(false)
const authTab = ref('login')

// Toast system
// ...

onMounted(async () => {
  if (route.query.auth === 'login') { /* ... */ }
  
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    await loadUserInfo()
    // Also restore username from localStorage if session exists but username not set
    if (!username.value) {
      const saved = localStorage.getItem('sb_username')
      if (saved) username.value = saved
    }
  }
  
  const savedLang = localStorage.getItem('lang')
  // ...
  
  fetchGames()
})

async function loadUserInfo() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  isLoggedIn.value = true
  username.value = user.user_metadata?.username || user.email?.split('@')[0] || 'PLAYER'
  // Store in localStorage for other pages
  localStorage.setItem('sb_username', username.value)
  await fetchBalance()
}

// ... fetchBalance unchanged ...

// Form validation (unchanged)

// Login
const loginUsername = ref('')
const loginPassword = ref('')
const loginLoading = ref(false)
const loginError = ref('')
async function doLogin() {
  loginError.value = ''
  if (!loginUsernameValid.value || !loginPasswordValid.value) return
  loginLoading.value = true
  try {
    const email = `${loginUsername.value.toUpperCase()}@novabett.internal`
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: loginPassword.value })
    if (error) throw error
    if (data.session?.access_token) localStorage.setItem('sb_token', data.session.access_token)
    await loadUserInfo() // this also stores username
    addToast('Successfully logged in', 'success')
    showAuthModal.value = false
    loginUsername.value = ''; loginPassword.value = ''
  } catch (e) {
    loginError.value = e.message
    addToast(e.message, 'error')
  } finally { loginLoading.value = false }
}

// Register
const regUsername = ref('')
const regPhone = ref('')
const regPassword = ref('')
const regLoading = ref(false)
const regError = ref('')
async function doRegister() {
  regError.value = ''
  if (!regUsernameValid.value || !regPasswordValid.value || !regPhoneValid.value) return
  regLoading.value = true
  try {
    // Capture referral from route query
    const referral = route.query.dl || ''
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/register3', {
      method: 'POST',
      headers: { 'Authorization': `Bearer sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb`, 'apikey': 'sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb', 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: regUsername.value, phone: regPhone.value, password: regPassword.value, referral: referral })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    const email = `${regUsername.value.toUpperCase()}@novabett.internal`
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password: regPassword.value })
    if (loginError) throw loginError
    if (loginData.session?.access_token) localStorage.setItem('sb_token', loginData.session.access_token)
    await loadUserInfo() // stores username
    addToast('Account created successfully!', 'success')
    showAuthModal.value = false
    regUsername.value = ''; regPhone.value = ''; regPassword.value = ''
  } catch (e) {
    regError.value = e.message
    addToast(e.message, 'error')
  } finally { regLoading.value = false }
}

// Games fetch (unchanged)
// ...

// ... rest of the script unchanged ...
</script>
