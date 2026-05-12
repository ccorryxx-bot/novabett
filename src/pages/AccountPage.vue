<template>
  <div class="min-h-screen bg-[#0a0a14] text-white pb-20 relative overflow-hidden">
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 -right-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>

    <header class="sticky top-0 z-30 bg-black/70 backdrop-blur-lg border-b border-white/10 px-4 py-2">
      <h2 class="text-lg font-bold text-center bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">{{ $t('profile') }}</h2>
    </header>

    <div class="px-4 pt-4 space-y-4 relative z-10">
      
      <!-- Profile Banner -->
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-purple-600 flex items-center justify-center text-2xl font-black shadow-lg">
            {{ username.charAt(0) }}
          </div>
          <div class="flex-1">
            <p class="text-xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{{ username }}</p>
            <p class="text-xs text-gray-400 font-mono mt-1">Game ID: {{ gameId }}</p>
            <span class="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold border" :class="vipBadgeClass">
              VIP {{ vipLevel }}
            </span>
          </div>
        </div>
      </div>

      <!-- VIP Level Card -->
      <div class="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden">
        <div class="absolute inset-0 rounded-2xl blur-xl opacity-20" :class="vipGlowColor"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider">Next Level Bonus</p>
              <p class="text-2xl font-black text-yellow-300">{{ nextBonus }}%</p>
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
              <div class="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <p class="text-[10px] text-gray-500 mt-1">Deposit {{ formatCurrency(remaining) }} more to reach VIP {{ nextLevel }}</p>
          </div>
        </div>
      </div>

      <!-- Balances (Real from DB) -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center shadow-xl">
          <p class="text-xs text-gray-400">{{ $t('mainBalance') }}</p>
          <p class="text-lg font-black text-emerald-400">{{ formatCurrency(mainBalance) }}</p>
        </div>
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center shadow-xl">
          <p class="text-xs text-gray-400">{{ $t('bonusBalance') }}</p>
          <p class="text-lg font-black text-yellow-300">{{ formatCurrency(bonusBalance) }}</p>
        </div>
      </div>

      <!-- Wagering Progress -->
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl">
        <h3 class="text-sm font-bold text-white mb-2">{{ $t('wageringProgress') }}</h3>
        <div v-if="wageringTarget > 0">
          <div class="flex justify-between text-xs text-gray-400">
            <span>{{ $t('remaining') }}</span>
            <span>{{ formatCurrency(wageringRemaining) }} / {{ formatCurrency(wageringTarget) }}</span>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
            <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" :style="{ width: wageringPercent + '%' }"></div>
          </div>
        </div>
        <p v-else class="text-xs text-gray-500 text-center py-2">{{ $t('noWagering') }}</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-2">
        <button @click="$router.push('/home')" class="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-2 text-center hover:bg-emerald-500/30 transition-all active:scale-95">
          <span class="text-xl">💰</span>
          <p class="text-[10px] font-bold text-emerald-400 mt-0.5">{{ $t('depositBtn') }}</p>
        </button>
        <button @click="$router.push('/home')" class="bg-rose-500/20 border border-rose-500/30 rounded-xl p-2 text-center hover:bg-rose-500/30 transition-all active:scale-95">
          <span class="text-xl">💸</span>
          <p class="text-[10px] font-bold text-rose-400 mt-0.5">{{ $t('withdrawBtn') }}</p>
        </button>
        <button @click="comingSoon" class="bg-blue-500/20 border border-blue-500/30 rounded-xl p-2 text-center hover:bg-blue-500/30 transition-all active:scale-95">
          <span class="text-xl">📋</span>
          <p class="text-[10px] font-bold text-blue-400 mt-0.5">{{ $t('history') }}</p>
        </button>
        <button @click="logout" class="bg-red-500/20 border border-red-500/30 rounded-xl p-2 text-center hover:bg-red-500/30 transition-all active:scale-95">
          <span class="text-xl">🚪</span>
          <p class="text-[10px] font-bold text-red-400 mt-0.5">{{ $t('logout') }}</p>
        </button>
      </div>

    </div>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 z-40">
      <div class="flex justify-around items-center py-2">
        <router-link to="/home" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><span class="text-lg">🏠</span><span class="text-[10px]">{{ $t('home') }}</span></router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><span class="text-lg">🎁</span><span class="text-[10px]">{{ $t('promotions') }}</span></router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><span class="text-lg">👥</span><span class="text-[10px]">{{ $t('agent') }}</span></router-link>
        <router-link to="/service" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors"><span class="text-lg">💬</span><span class="text-[10px]">{{ $t('service') }}</span></router-link>
        <router-link to="/account" class="flex flex-col items-center gap-0.5 text-yellow-400 transition-colors"><span class="text-lg">👤</span><span class="text-[10px]">{{ $t('account') }}</span></router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const username = ref(localStorage.getItem('sb_username') || 'PLAYER')
const gameId = ref('') // Will be set from user id

const mainBalance = ref(0)
const bonusBalance = ref(0)

async function fetchWallet() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    gameId.value = user.id.substring(0, 8).toUpperCase() // Use real user id as Game ID
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

onMounted(fetchWallet)

// VIP logic (same as before)
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
  const colors = { 1: 'bg-gray-500', 2: 'bg-green-500', 3: 'bg-blue-500', 4: 'bg-purple-500', 5: 'bg-yellow-500', 6: 'bg-red-500', 7: 'bg-blue-200', 8: 'bg-gray-300', 9: 'bg-yellow-200', 10: 'bg-yellow-400' }
  return colors[vipLevel.value] || 'bg-gray-500'
})
const vipBadgeClass = computed(() => {
  const base = 'text-xs font-bold border'
  switch (vipLevel.value) {
    case 10: return `${base} bg-yellow-400/20 text-yellow-400 border-yellow-400/40`
    case 9: return `${base} bg-yellow-200/20 text-yellow-200 border-yellow-200/40`
    case 8: return `${base} bg-gray-300/20 text-gray-300 border-gray-300/40`
    case 7: return `${base} bg-blue-200/20 text-blue-400 border-blue-200/40`
    case 6: return `${base} bg-red-500/20 text-red-400 border-red-400/40`
    case 5: return `${base} bg-yellow-500/20 text-yellow-400 border-yellow-400/40`
    case 4: return `${base} bg-purple-500/20 text-purple-400 border-purple-400/40`
    case 3: return `${base} bg-blue-500/20 text-blue-400 border-blue-400/40`
    case 2: return `${base} bg-green-500/20 text-green-400 border-green-400/40`
    default: return `${base} bg-gray-500/20 text-gray-400 border-gray-400/40`
  }
})

const wageringTarget = ref(170000)
const wageringCompleted = ref(56000)
const wageringRemaining = computed(() => Math.max(0, wageringTarget.value - wageringCompleted.value))
const wageringPercent = computed(() => Math.round((wageringCompleted.value / wageringTarget.value) * 100) || 0)

const formatCurrency = (num) => new Intl.NumberFormat('en-US').format(num)

const logout = () => {
  localStorage.removeItem('sb_token')
  localStorage.removeItem('sb_refresh')
  localStorage.removeItem('sb_username')
  window.location.href = '/login'
}

const comingSoon = () => alert('Coming Soon')
</script>
