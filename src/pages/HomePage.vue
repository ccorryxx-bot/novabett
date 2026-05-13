<template>
  <div class="min-h-screen bg-black text-white flex flex-col selection:bg-yellow-500/30">
    <div class="flex-1">
      <div class="px-4 pt-6 pb-2 space-y-4 relative z-10">
        <!-- Welcome Text -->
        <p class="text-center text-gray-500 text-[11px] font-semibold uppercase tracking-[0.3em] animate-fade-in">
          Welcome to <span class="text-yellow-400">NovaBETT</span>
        </p>

        <!-- Brand Name with animated glow (no jackpot banner) -->
        <div class="text-center">
          <h1 class="text-4xl font-black tracking-tighter relative inline-block">
            <span class="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              NovaBETT
            </span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
          </h1>
          <p class="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mt-1">Premium Online Casino</p>
        </div>

        <!-- Top row: Search + Login/User info -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button @click="toggleSearch" class="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 pointer-events-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <!-- Single Login button (when logged out) -->
            <template v-if="!isLoggedIn">
              <button @click="showAuthModal = true" class="text-sm font-semibold text-gray-300 hover:text-white transition-colors">Login</button>
            </template>
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggleLanguage" class="text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full transition-all pointer-events-auto">
              {{ currentLang === 'en' ? 'မြန်မာ' : 'English' }}
            </button>
          </div>
        </div>

        <!-- User Info Row (if logged in) -->
        <div v-if="isLoggedIn" class="flex items-center justify-between bg-[#111] border border-white/5 rounded-2xl px-4 py-3 shadow">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg" :style="{ background: avatarColor }">
              {{ username.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-bold text-white">{{ username }}</p>
              <p class="text-xs text-gray-400">
                <span v-if="balanceLoading" class="animate-pulse">...</span>
                <span v-else class="text-emerald-400 font-semibold">{{ formatCurrency(mainBalance) }} Ks</span>
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="showDepositModal = true" class="bg-white hover:bg-gray-200 text-black text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-all">Deposit</button>
            <button @click="showWithdrawModal = true" class="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/10 active:scale-95 transition-all">Withdraw</button>
          </div>
        </div>

        <!-- Search bar (togglable) -->
        <div v-if="searchVisible" class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search games..." class="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all text-sm" />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <!-- Carousel -->
      <div class="px-4 pt-4">
        <div class="rounded-2xl overflow-hidden relative h-40 bg-[#111] border border-white/5 shadow-xl">
          <div class="absolute inset-0 flex transition-transform duration-500" :style="{ transform: `translateX(-${carouselIndex * 100}%)` }">
            <div v-for="(img, i) in carouselImages" :key="i" class="w-full h-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-white/30" :style="{ background: img.color }">
              <span class="text-white/80 text-lg font-semibold tracking-wider">{{ img.title }}</span>
            </div>
          </div>
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            <button v-for="(img, i) in carouselImages" :key="i" @click="carouselIndex = i" class="w-2 h-2 rounded-full transition-all" :class="i === carouselIndex ? 'bg-white w-4' : 'bg-white/30'"></button>
          </div>
          <button @click="prevSlide" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
          <button @click="nextSlide" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
        </div>
      </div>

      <!-- Game Categories with Provider Logos -->
      <div class="px-4 pt-6 pb-3">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Game Categories</h2>
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button v-for="cat in categories" :key="cat.name" @click="activeCategory = cat.name"
            class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border"
            :class="activeCategory === cat.name ? 'bg-white text-black border-transparent shadow' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'">
            <img v-if="cat.logo" :src="cat.logo" class="w-4 h-4 object-contain rounded-full" alt="" />
            <span v-else class="text-[10px] font-bold tracking-tight">{{ cat.name.toUpperCase() }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Game Cards Grid -->
      <div class="px-4">
        <div class="grid grid-cols-3 gap-3">
          <div v-for="game in filteredGames" :key="game.id" @click="openGame(game)"
            class="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden active:scale-95 transition-all duration-200 cursor-pointer hover:border-white/20 hover:shadow-xl">
            <div class="relative w-full aspect-square bg-black/40 flex items-center justify-center overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <span class="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-[9px] font-bold text-white/80">{{ game.provider }}</span>
              <span class="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">🎰</span>
            </div>
            <div class="p-2"><h3 class="text-[11px] font-semibold leading-tight truncate text-gray-300">{{ game.name }}</h3></div>
          </div>
        </div>
      </div>

      <!-- Extra space & footer -->
      <div class="h-6"></div>
      <div class="px-4 text-center text-xs text-gray-600">
        <p class="py-4">More games coming soon...</p>
      </div>
      <div class="h-8 border-t border-white/5 mx-4"></div>

      <!-- Footer Buttons -->
      <div class="px-4 pb-24 space-y-3 mt-4">
        <div class="grid grid-cols-3 gap-3">
          <button @click="showFooterModal('team')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-center text-xs font-semibold text-gray-400 hover:text-white transition-all">NovaBETT Team</button>
          <button @click="showFooterModal('terms')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-center text-xs font-semibold text-gray-400 hover:text-white transition-all">Terms of Service</button>
          <button @click="showFooterModal('plus18')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-center text-xs font-semibold text-gray-400 hover:text-white transition-all">18+</button>
        </div>
        <p class="text-center text-[10px] text-gray-600">&copy; 2026 NovaBETT. All rights reserved.</p>
      </div>
    </div>

    <!-- Bottom Navigation (fixed) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 pointer-events-auto safe-area-bottom">
      <div class="flex justify-around items-center py-2 px-1">
        <router-link to="/home" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 pointer-events-auto" :class="$route.path === '/home' ? 'text-white' : 'text-gray-500 hover:text-gray-300'">
          <div class="relative">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span v-if="$route.path === '/home'" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <span class="text-[10px] font-semibold">Home</span>
        </router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 pointer-events-auto" :class="$route.path === '/promotions' ? 'text-white' : 'text-gray-500 hover:text-gray-300'">
          <div class="relative">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12v8H4v-8l8-8 8 8zm-2 2H6v4h12v-4zM12 2l-8 8h16l-8-8z"/></svg>
            <span v-if="$route.path === '/promotions'" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <span class="text-[10px] font-semibold">Promos</span>
        </router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 pointer-events-auto" :class="$route.path === '/agent' ? 'text-white' : 'text-gray-500 hover:text-gray-300'">
          <div class="relative">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            <span v-if="$route.path === '/agent'" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <span class="text-[10px] font-semibold">Agents</span>
        </router-link>
        <router-link to="/service" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 pointer-events-auto" :class="$route.path === '/service' ? 'text-white' : 'text-gray-500 hover:text-gray-300'">
          <div class="relative">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            <span v-if="$route.path === '/service'" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <span class="text-[10px] font-semibold">Chat</span>
        </router-link>
        <router-link to="/account" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 pointer-events-auto" :class="$route.path === '/account' ? 'text-white' : 'text-gray-500 hover:text-gray-300'">
          <div class="relative">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            <span v-if="$route.path === '/account'" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <span class="text-[10px] font-semibold">You</span>
        </router-link>
      </div>
    </nav>

    <!-- ===== AUTH MODAL (Login / Register Tabs) ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAuthModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="showAuthModal = false">
          <div class="bg-[#141428] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <!-- Tabs -->
            <div class="flex mb-6">
              <button @click="authTab = 'login'" :class="authTab === 'login' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'" class="flex-1 py-2 rounded-l-full text-sm font-semibold transition-colors">Login</button>
              <button @click="authTab = 'register'" :class="authTab === 'register' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'" class="flex-1 py-2 rounded-r-full text-sm font-semibold transition-colors">Register</button>
            </div>

            <!-- Login Form -->
            <div v-if="authTab === 'login'" class="space-y-4">
              <input v-model="loginUsername" placeholder="Username" class="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white uppercase focus:outline-none focus:border-white/30 transition-all text-sm" @input="loginUsername = loginUsername.toUpperCase()" />
              <input v-model="loginPassword" type="password" placeholder="Password" class="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-all text-sm" />
              <button @click="doLogin" :disabled="loginLoading" class="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-2xl shadow transition-all disabled:opacity-50">{{ loginLoading ? 'Signing In...' : 'Sign In' }}</button>
              <p class="text-red-400 text-sm text-center">{{ loginError }}</p>
            </div>

            <!-- Register Form -->
            <div v-else class="space-y-4">
              <input v-model="regUsername" placeholder="Username" class="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white uppercase focus:outline-none focus:border-white/30 transition-all text-sm" @input="regUsername = regUsername.toUpperCase()" />
              <input v-model="regPhone" type="tel" placeholder="Phone (9...)" class="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-all text-sm" />
              <input v-model="regPassword" type="password" placeholder="Password" class="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-all text-sm" />
              <button @click="doRegister" :disabled="regLoading" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl shadow transition-all disabled:opacity-50">{{ regLoading ? 'Creating Account...' : 'Join NovaBETT' }}</button>
              <p class="text-red-400 text-sm text-center">{{ regError }}</p>
            </div>

            <button @click="showAuthModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer Modals (team, terms, 18+) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="footerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="footerModal = null">
          <div class="bg-[#141428] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
            <h2 class="text-xl font-bold text-white text-center mb-4">{{ footerModalTitle }}</h2>
            <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{{ footerModalContent }}</p>
            <button @click="footerModal = null" class="mt-6 w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-2xl shadow transition-all">Close</button>
            <button @click="footerModal = null" class="absolute top-4 right-4 text-gray-400 hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Deposit/Withdraw Modals -->
    <DepositModal v-model="showDepositModal" @submit="handleDepositSubmit" />
    <WithdrawModal v-model="showWithdrawModal" :balance="mainBalance" @submit="handleWithdrawSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import DepositModal from '@/components/DepositModal.vue'
import WithdrawModal from '@/components/WithdrawModal.vue'

const { locale } = useI18n()
const currentLang = ref(locale.value)
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'mm' : 'en'
  currentLang.value = locale.value
  localStorage.setItem('lang', locale.value)
}

// Auth state
const isLoggedIn = ref(false)
const username = ref('')
const mainBalance = ref(0)
const balanceLoading = ref(false)

// Avatar random colors
const avatarColors = [
  'linear-gradient(135deg, #f6d365, #fda085)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #84fab0, #8fd3f4)'
]
const avatarColor = ref(avatarColors[0])

// Auth modal
const showAuthModal = ref(false)
const authTab = ref('login') // 'login' or 'register'

onMounted(async () => {
  // Ensure modals are hidden on load
  showAuthModal.value = false
  const { data: { session } } = await supabase.auth.getSession()
  if (session) await loadUserInfo()
  const savedLang = localStorage.getItem('lang')
  if (savedLang) { locale.value = savedLang; currentLang.value = savedLang }
  let storedAvatar = localStorage.getItem('avatarIndex')
  if (storedAvatar === null) {
    storedAvatar = Math.floor(Math.random() * avatarColors.length)
    localStorage.setItem('avatarIndex', storedAvatar)
  }
  avatarColor.value = avatarColors[storedAvatar]
})

async function loadUserInfo() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  isLoggedIn.value = true
  username.value = user.user_metadata?.username || user.email?.split('@')[0] || 'PLAYER'
  await fetchBalance()
}

async function fetchBalance() {
  balanceLoading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: wallet } = await supabase.from('wallets').select('main_balance').select('main_balance').eq('user_id', user.id).single()
    mainBalance.value = wallet?.main_balance || 0
  } catch (e) { console.error(e) } finally { balanceLoading.value = false }
}

// Login logic
const loginUsername = ref('')
const loginPassword = ref('')
const loginLoading = ref(false)
const loginError = ref('')
async function doLogin() {
  loginError.value = ''
  if (!loginUsername.value || !loginPassword.value) { loginError.value = 'Fill all fields'; return }
  loginLoading.value = true
  try {
    const email = `${loginUsername.value.toUpperCase()}@novabett.internal`
    const { error } = await supabase.auth.signInWithPassword({ email, password: loginPassword.value })
    if (error) throw error
    await loadUserInfo()
    showAuthModal.value = false
    loginUsername.value = ''; loginPassword.value = ''
  } catch (e) { loginError.value = e.message } finally { loginLoading.value = false }
}

// Register logic
const regUsername = ref('')
const regPhone = ref('')
const regPassword = ref('')
const regLoading = ref(false)
const regError = ref('')
async function doRegister() {
  regError.value = ''
  if (!regUsername.value || !regPhone.value || !regPassword.value) { regError.value = 'Fill all fields'; return }
  regLoading.value = true
  try {
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/register3', {
      method: 'POST',
      headers: { 'Authorization': `Bearer sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb`, 'apikey': 'sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb', 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: regUsername.value, phone: regPhone.value, password: regPassword.value })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    const email = `${regUsername.value.toUpperCase()}@novabett.internal`
    await supabase.auth.signInWithPassword({ email, password: regPassword.value })
    await loadUserInfo()
    showAuthModal.value = false
    regUsername.value = ''; regPhone.value = ''; regPassword.value = ''
  } catch (e) { regError.value = e.message } finally { regLoading.value = false }
}

// Jackpot (still kept but not displayed, just logic)
const jackpot = ref(893619157998)
const displayedJackpot = ref('893,619,157,998')
const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num)
onMounted(() => {
  setInterval(() => {
    const inc = Math.floor(Math.random() * 500000 + 100000)
    jackpot.value += inc
    animateValue(jackpot.value - inc, jackpot.value)
  }, 5000)
})
function animateValue(start, end) {
  let current = start
  const range = end - start, dur = 800, stepTime = 20, steps = dur / stepTime, inc = range / steps
  let step = 0
  const timer = setInterval(() => {
    current += inc
    if (step >= steps) { current = end; clearInterval(timer) }
    displayedJackpot.value = formatNumber(Math.floor(current))
    step++
  }, stepTime)
}
const formatCurrency = (num) => new Intl.NumberFormat('en-US').format(num)

// Carousel
const carouselImages = [
  { color: 'linear-gradient(135deg, #1a1a2e, #16213e)', title: 'SLOT GAMES' },
  { color: 'linear-gradient(135deg, #0f3460, #533483)', title: 'FISHING' },
  { color: 'linear-gradient(135deg, #e94560, #0f3460)', title: 'LIVE CASINO' },
  { color: 'linear-gradient(135deg, #f5a623, #e94560)', title: 'SPORTS' },
  { color: 'linear-gradient(135deg, #00b4d8, #0077b6)', title: 'ARCADE' }
]
const carouselIndex = ref(0)
let carouselTimer
onMounted(() => { carouselTimer = setInterval(() => nextSlide(), 4000) })
const prevSlide = () => { carouselIndex.value = carouselIndex.value === 0 ? carouselImages.length - 1 : carouselIndex.value - 1; resetTimer() }
const nextSlide = () => { carouselIndex.value = (carouselIndex.value + 1) % carouselImages.length; resetTimer() }
const resetTimer = () => { clearInterval(carouselTimer); carouselTimer = setInterval(() => nextSlide(), 4000) }

// Search
const searchVisible = ref(false)
const searchQuery = ref('')
const toggleSearch = () => { searchVisible.value = !searchVisible.value }

// Categories & Games
const categories = ref([
  { name: 'All', logo: null },
  { name: 'JILI', logo: '/images/providers/jili.png' },
  { name: 'PP', logo: '/images/providers/pp.png' },
  { name: 'PG', logo: '/images/providers/pg.png' },
  { name: 'Pragmatic', logo: '/images/providers/pragmatic.png' },
  { name: 'Live', logo: null },
  { name: 'Fishing', logo: null }
])
const activeCategory = ref('All')
const games = ref([
  { id: 1, name: 'Jackpot Fishing', provider: 'JILI', category: 'Fishing' },
  { id: 2, name: 'Gates of Olympus', provider: 'Pragmatic', category: 'Slot' },
  { id: 3, name: 'Mahjong Ways 2', provider: 'PG', category: 'Slot' },
  { id: 4, name: 'Charge Buffalo', provider: 'JILI', category: 'Slot' },
  { id: 5, name: 'Money Boxing', provider: 'PP', category: 'Slot' },
  { id: 6, name: 'Boxing King', provider: 'PG', category: 'Slot' },
  { id: 7, name: 'Fortune Coins', provider: 'PP', category: 'Slot' },
  { id: 8, name: 'Fortune Gems 2', provider: 'PG', category: 'Slot' },
  { id: 9, name: 'Dragon Fortune', provider: 'JILI', category: 'Slot' },
  { id: 10, name: 'Golden Empire', provider: 'Pragmatic', category: 'Slot' },
  { id: 11, name: 'Super Ace', provider: 'PG', category: 'Slot' },
  { id: 12, name: 'Crazy777', provider: 'JILI', category: 'Slot' }
])
const filteredGames = computed(() => {
  let list = games.value
  if (activeCategory.value !== 'All') list = list.filter(g => g.provider === activeCategory.value || g.category === activeCategory.value)
  if (searchQuery.value) list = list.filter(g => g.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  return list
})
const openGame = (game) => alert(`Opening ${game.name}`)

// Deposit / Withdraw
const showDepositModal = ref(false)
const showWithdrawModal = ref(false)
const handleDepositSubmit = (data) => console.log('Deposit:', data)
const handleWithdrawSubmit = (data) => console.log('Withdraw:', data)

// Footer modals
const footerModal = ref(null)
const footerModalTitle = computed(() => {
  switch (footerModal.value) {
    case 'team': return 'NovaBETT Team'
    case 'terms': return 'Terms of Service'
    case 'plus18': return '18+ Responsible Gaming'
    default: return ''
  }
})
const footerModalContent = computed(() => {
  switch (footerModal.value) {
    case 'team': return 'We are a passionate team...'
    case 'terms': return 'Please read our terms...'
    case 'plus18': return 'You must be 18+ to play.'
    default: return ''
  }
})
const showFooterModal = (type) => { footerModal.value = type }
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.modal-enter-active { animation: slideUp 0.3s ease-out; }
.modal-leave-active { animation: slideUp 0.2s ease-in reverse; }
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
.animate-shimmer { background-size: 200% auto; animation: shimmer 3s linear infinite; }
.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>
