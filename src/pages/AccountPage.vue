<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 pb-20 relative overflow-hidden">
    <header class="sticky top-0 z-30 bg-[#0b141a]/80 backdrop-blur-lg border-b border-cyan-500/10 px-4 py-2">
      <h2 class="text-lg font-bold text-center text-cyan-300">{{ $t('profile') }}</h2>
    </header>

    <div class="px-4 pt-4 space-y-4 relative z-10">
      
      <!-- Profile Banner -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-4 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
            {{ username.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1">
            <p class="text-lg font-extrabold text-white">{{ username }}</p>
            <p class="text-xs text-gray-400 font-mono mt-1">Game ID: {{ gameId }}</p>
            <span class="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold border"
              :class="vipBadgeClass">
              VIP {{ vipLevel }}
            </span>
          </div>
        </div>
      </div>

      <!-- VIP Level Card -->
      <div class="relative bg-[#111d26] border border-cyan-500/10 rounded-2xl p-4 shadow-sm overflow-hidden">
        <div class="absolute inset-0 rounded-2xl blur-xl opacity-20" :class="vipGlowColor"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider">Next Level Bonus</p>
              <p class="text-2xl font-black text-cyan-300">{{ nextBonus }}%</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">Progress</p>
              <p class="text-sm font-bold text-white">{{ progressPercent }}%</p>
            </div>
          </div>
          <div class="mt-2">
            <div class="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>{{ formatCurrency(deposited) }} Ks</span>
              <span>{{ formatCurrency(nextLevelTarget) }} Ks</span>
            </div>
            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full transition-all" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <p class="text-[10px] text-gray-500 mt-1">Deposit {{ formatCurrency(remaining) }} more to reach VIP {{ nextLevel }}</p>
          </div>
        </div>
      </div>

      <!-- Balances -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-3 text-center shadow-sm">
          <p class="text-xs text-gray-400">{{ $t('mainBalance') }}</p>
          <p class="text-lg font-black text-cyan-400">{{ formatCurrency(mainBalance) }}</p>
        </div>
        <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-3 text-center shadow-sm">
          <p class="text-xs text-gray-400">{{ $t('bonusBalance') }}</p>
          <p class="text-lg font-black text-cyan-300">{{ formatCurrency(bonusBalance) }}</p>
        </div>
      </div>

      <!-- Wagering Progress -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-4 shadow-sm">
        <h3 class="text-sm font-bold text-white mb-2">{{ $t('wageringProgress') }}</h3>
        <div v-if="wageringTarget > 0">
          <div class="flex justify-between text-xs text-gray-400">
            <span>{{ $t('remaining') }}</span>
            <span>{{ formatCurrency(wageringRemaining) }} / {{ formatCurrency(wageringTarget) }}</span>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all" :style="{ width: wageringPercent + '%' }"></div>
          </div>
        </div>
        <p v-else class="text-xs text-gray-500 text-center py-2">{{ $t('noWagering') }}</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-2">
        <button @click="$router.push('/home')" class="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center hover:bg-cyan-500/20 transition-all active:scale-95">
          <!-- Deposit Icon SVG -->
          <svg class="w-6 h-6 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/><circle cx="12" cy="12" r="3"/></svg>
          <p class="text-[10px] font-bold text-cyan-300 mt-1">{{ $t('depositBtn') }}</p>
        </button>
        <button @click="$router.push('/home')" class="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center hover:bg-cyan-500/20 transition-all active:scale-95">
          <!-- Withdraw Icon SVG -->
          <svg class="w-6 h-6 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20V4m-8 8h16"/><circle cx="12" cy="12" r="3"/></svg>
          <p class="text-[10px] font-bold text-cyan-300 mt-1">{{ $t('withdrawBtn') }}</p>
        </button>
        <button @click="comingSoon" class="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center hover:bg-cyan-500/20 transition-all active:scale-95">
          <!-- History Icon SVG -->
          <svg class="w-6 h-6 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-[10px] font-bold text-cyan-300 mt-1">{{ $t('history') }}</p>
        </button>
        <button @click="logout" class="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center hover:bg-red-500/20 transition-all active:scale-95">
          <!-- Logout Icon SVG -->
          <svg class="w-6 h-6 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <p class="text-[10px] font-bold text-red-400 mt-1">{{ $t('logout') }}</p>
        </button>
      </div>

    </div>

    <!-- Bottom Nav (Same as HomePage) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0b141a]/95 backdrop-blur-xl border-t border-cyan-500/10 z-40">
      <div class="flex justify-around items-center py-2">
        <router-link to="/home" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg><span class="text-[10px]">{{ $t('home') }}</span></router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12v8H4v-8l8-8 8 8zm-2 2H6v4h12v-4zM12 2l-8 8h16l-8-8z"/></svg><span class="text-[10px]">{{ $t('promotions') }}</span></router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg><span class="text-[10px]">{{ $t('agent') }}</span></router-link>
        <router-link to="/service" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg><span class="text-[10px]">{{ $t('service') }}</span></router-link>
        <router-link to="/account" class="flex flex-col items-center gap-0.5 text-cyan-400 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg><span class="text-[10px]">{{ $t('account') }}</span></router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'

const { t } = useI18n()

const username = ref(localStorage.getItem('sb_username') || 'PLAYER')
const gameId = ref('')
const mainBalance = ref(0)
const bonusBalance = ref(0)
const balanceLoading = ref(false)

async function fetchWallet() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    gameId.value = user.id.substring(0, 8).toUpperCase()
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('main_balance, bonus_balance')
      .eq('user_id', user.id)
      .single()
    if (wallet && !error) {
      mainBalance.value = wallet.main_balance
      bonusBalance.value = wallet.bonus_balance
      await fetchTotalDeposited(user.id)
    }
  } catch (e) {
    console.error('Failed to fetch wallet:', e)
  }
}

const deposited = ref(0)
async function fetchTotalDeposited(userId) {
  const { data } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'deposit')
    .eq('status', 'confirmed')
  if (data) {
    deposited.value = data.reduce((sum, tx) => sum + Number(tx.amount), 0)
  }
}

onMounted(() => {
  fetchWallet()
  setInterval(fetchWallet, 5000) // Auto-refresh balance every 5 seconds
})

const vipLevel = computed(() => {
  if (deposited.value >= 500000) return 10
  if (deposited.value >= 300000) return 9
  if (deposited.value >= 200000) return 8
  if (deposited.value >= 150000) return 7
  if (deposited.value >= 100000) return 6
  if (deposited.value >= 80000) return 5
  if (deposited.value >= 60000) return 4
  if (deposited.value >= 40000) return 3
  if (deposited.value >= 10000) return 2
  return 1
})

const vipLevels = { 1: 10000, 2: 40000, 3: 60000, 4: 80000, 5: 100000, 6: 150000, 7: 200000, 8: 300000, 9: 500000, 10: Infinity }
const nextLevel = computed(() => Math.min(vipLevel.value + 1, 10))
const nextLevelTarget = computed(() => vipLevels[nextLevel.value] || 0)
const remaining = computed(() => Math.max(0, nextLevelTarget.value - deposited.value))
const progressPercent = computed(() => {
  if (nextLevelTarget.value === Infinity) return 100
  const prevTarget = vipLevels[vipLevel.value] || 0
  const progress = (deposited.value - prevTarget) / (nextLevelTarget.value - prevTarget) * 100
  return Math.min(100, Math.max(0, Math.round(progress)))
})

const nextBonus = computed(() => {
  const bonuses = { 1: 10, 2: 30, 3: 40, 4: 50, 5: 55, 6: 60, 7: 70, 8: 80, 9: 100, 10: 120 }
  return bonuses[nextLevel.value] || 0
})

const vipGlowColor = computed(() => {
  const colors = { 1: 'bg-gray-500', 2: 'bg-green-500', 3: 'bg-blue-500', 4: 'bg-purple-500', 5: 'bg-yellow-500', 6: 'bg-red-500', 7: 'bg-cyan-200', 8: 'bg-gray-300', 9: 'bg-yellow-200', 10: 'bg-yellow-400' }
  return colors[vipLevel.value] || 'bg-gray-500'
})

const vipBadgeClass = computed(() => {
  const base = 'text-xs font-bold border'
  switch (vipLevel.value) {
    case 10: return `${base} bg-yellow-400/20 text-yellow-400 border-yellow-400/40`
    case 9: return `${base} bg-yellow-200/20 text-yellow-200 border-yellow-200/40`
    case 8: return `${base} bg-gray-300/20 text-gray-300 border-gray-300/40`
    case 7: return `${base} bg-cyan-200/20 text-cyan-400 border-cyan-200/40`
    case 6: return `${base} bg-red-500/20 text-red-400 border-red-400/40`
    case 5: return `${base} bg-yellow-500/20 text-yellow-400 border-yellow-400/40`
    case 4: return `${base} bg-purple-500/20 text-purple-400 border-purple-400/40`
    case 3: return `${base} bg-blue-500/20 text-blue-400 border-blue-400/40`
    case 2: return `${base} bg-green-500/20 text-green-400 border-green-400/40`
    default: return `${base} bg-gray-500/20 text-gray-400 border-gray-400/40`
  }
})

const wageringTarget = ref(0)
const wageringCompleted = ref(0)
const wageringRemaining = computed(() => Math.max(0, wageringTarget.value - wageringCompleted.value))
const wageringPercent = computed(() => Math.round((wageringCompleted.value / wageringTarget.value) * 100) || 0)

const formatCurrency = (num) => new Intl.NumberFormat('en-US').format(num)

const logout = async () => {
  await supabase.auth.signOut()
  localStorage.removeItem('sb_token')
  localStorage.removeItem('sb_refresh')
  localStorage.removeItem('sb_username')
  localStorage.removeItem('avatarIndex')
  window.location.href = '/login'
}

const comingSoon = () => alert('Coming Soon')
</script>
