<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 pb-20 relative overflow-hidden">
    <header class="sticky top-0 z-30 bg-[#0b141a]/80 backdrop-blur-lg border-b border-cyan-500/10 px-4 py-2">
      <h2 class="text-lg font-bold text-center text-cyan-300">{{ $t('agent') }}</h2>
      <!-- Tab Bar -->
      <div class="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
        <button v-for="(tab, i) in tabs" :key="i" @click="activeTab = i"
          class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
          :class="activeTab === i ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-cyan-500/5 border-gray-700 text-gray-400 hover:bg-cyan-500/10'">
          {{ tab }}
        </button>
      </div>
    </header>

    <div class="px-4 pt-6 space-y-6 relative z-10">
      <!-- Tab 0: Overview -->
      <div v-if="activeTab === 0">
        <!-- Referral Link -->
        <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-cyan-300 flex items-center gap-2"><span>🔗</span> {{ $t('referralLink') }}</h3>
            <button @click="copyReferral" class="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
              {{ copied ? $t('copied') : $t('copy') }}
            </button>
          </div>
          <div class="bg-black/20 rounded-xl p-3 border border-cyan-500/10">
            <p class="text-sm text-gray-300 font-mono truncate">{{ referralLink }}</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 text-center">
            <p class="text-3xl font-black text-cyan-300">{{ downlineStats.total }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $t('totalDownline') }}</p>
          </div>
          <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 text-center">
            <p class="text-3xl font-black text-cyan-300">{{ downlineStats.active }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $t('activeNow') }}</p>
          </div>
        </div>

        <!-- Commission -->
        <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 flex justify-between items-center mt-4">
          <span class="text-gray-400 text-sm">{{ $t('totalCommission') }}</span>
          <span class="text-cyan-300 font-black text-xl">{{ totalCommission.toLocaleString() }} Ks</span>
        </div>

        <!-- Downline List -->
        <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 mt-4">
          <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>👥</span> {{ $t('yourDownline') }}</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-for="user in downlineUsers" :key="user.id" class="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-cyan-500/10">
              <div>
                <p class="text-sm font-semibold">{{ user.username }}</p>
                <p class="text-[10px] text-gray-500">ID: {{ user.id.slice(0,8) }}...</p>
              </div>
              <div class="text-right">
                <span :class="user.active ? 'text-cyan-400' : 'text-red-400'" class="text-[10px] font-bold">● {{ user.active ? $t('active') : $t('inactive') }}</span>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ $t('turnover') }}: {{ user.turnover.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 1: Tutorial -->
      <div v-else-if="activeTab === 1" class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>📘</span> {{ $t('tutorial') }}</h3>
        <div class="bg-black/20 rounded-xl p-4 space-y-3 text-sm text-gray-300">
          <div class="flex items-start gap-2">
            <span class="bg-cyan-500/20 text-cyan-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <p>{{ $t('level1') }}: Total Turnover × <span class="text-cyan-400 font-bold">10%</span></p>
          </div>
          <div class="flex items-start gap-2">
            <span class="bg-cyan-500/20 text-cyan-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <p>{{ $t('level2') }}: (Total Turnover × 10%) × 30% ≈ <span class="text-cyan-400 font-bold">3%</span></p>
          </div>
          <div class="flex items-start gap-2">
            <span class="bg-cyan-500/20 text-cyan-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">∞</span>
            <p>{{ $t('unlimited') }}</p>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ $t('winLossBasis') }}</p>
        </div>
      </div>

      <!-- Tab 2: My Data -->
      <div v-else-if="activeTab === 2" class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>📊</span> {{ $t('myData') }}</h3>
        <div class="space-y-3">
          <div class="flex justify-between bg-black/20 p-3 rounded-xl border border-cyan-500/10">
            <span class="text-gray-400 text-sm">{{ $t('today') }}</span>
            <span class="text-cyan-300 font-semibold">12,500 Ks</span>
          </div>
          <div class="flex justify-between bg-black/20 p-3 rounded-xl border border-cyan-500/10">
            <span class="text-gray-400 text-sm">{{ $t('yesterday') }}</span>
            <span class="text-cyan-300 font-semibold">8,200 Ks</span>
          </div>
          <div class="flex justify-between bg-black/20 p-3 rounded-xl border border-cyan-500/10">
            <span class="text-gray-400 text-sm">{{ $t('thisMonth') }}</span>
            <span class="text-cyan-300 font-semibold">145,000 Ks</span>
          </div>
        </div>
      </div>

      <!-- Tab 3: Downline Details -->
      <div v-else-if="activeTab === 3" class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>📋</span> {{ $t('details') }}</h3>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div v-for="user in downlineDetails" :key="user.id" class="bg-black/20 rounded-xl p-3 border border-cyan-500/10">
            <p class="text-sm font-semibold mb-2">{{ user.username }}</p>
            <div class="grid grid-cols-3 gap-2 text-[10px]">
              <div><span class="text-gray-500">{{ $t('depositAmt') }}</span><p class="text-white text-xs">{{ user.deposit.toLocaleString() }}</p></div>
              <div><span class="text-gray-500">{{ $t('turnover') }}</span><p class="text-white text-xs">{{ user.turnover.toLocaleString() }}</p></div>
              <div><span class="text-gray-500">{{ $t('profitLoss') }}</span><p :class="user.profit >= 0 ? 'text-cyan-400' : 'text-red-400'" class="text-xs">{{ user.profit.toLocaleString() }}</p></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 4: Search Downline -->
      <div v-else-if="activeTab === 4" class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>🔍</span> {{ $t('searchDownline') }}</h3>
        <input v-model="searchUsername" type="text" :placeholder="$t('searchDownline')" class="w-full p-3 rounded-xl bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 mb-4" />
        <div v-if="searchUsername" class="space-y-2">
          <div v-for="user in filteredDownline" :key="user.id" class="bg-black/20 rounded-xl p-3 border border-cyan-500/10">
            <p class="text-sm font-semibold">{{ user.username }}</p>
            <p class="text-[10px] text-gray-400">ID: {{ user.id.slice(0,12) }}...</p>
          </div>
          <p v-if="filteredDownline.length === 0" class="text-center text-gray-500 py-4 text-sm">{{ $t('notFound') }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0b141a]/95 backdrop-blur-xl border-t border-cyan-500/10 z-40">
      <div class="flex justify-around items-center py-2">
        <router-link to="/home" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span class="text-[10px]">{{ $t('home') }}</span>
        </router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12v8H4v-8l8-8 8 8zm-2 2H6v4h12v-4zM12 2l-8 8h16l-8-8z"/></svg>
          <span class="text-[10px]">{{ $t('promotions') }}</span>
        </router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-0.5 text-cyan-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span class="text-[10px]">{{ $t('agent') }}</span>
        </router-link>
        <router-link to="/service" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span class="text-[10px]">{{ $t('service') }}</span>
        </router-link>
        <router-link to="/account" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span class="text-[10px]">{{ $t('account') }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const storedUsername = localStorage.getItem('sb_username') || 'YOURNAME'
const referralLink = window.location.origin + '/?dl=' + storedUsername.toUpperCase()

const copied = ref(false)
const copyReferral = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(referralLink).then(() => { copied.value = true; setTimeout(() => copied.value = false, 2000) })
  } else {
    prompt('Copy manually:', referralLink)
  }
}

const activeTab = ref(0)
const tabs = [
  t('overview'),
  t('tutorial'),
  t('myData'),
  t('details'),
  t('searchDL')
]

const downlineUsers = ref([
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', username: 'PLAYER1', active: true, turnover: 250000 },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', username: 'PLAYER2', active: false, turnover: 120000 },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', username: 'PLAYER3', active: true, turnover: 500000 },
  { id: 'd4e5f6a7-b8c9-0123-defa-234567890123', username: 'PLAYER4', active: true, turnover: 80000 },
  { id: 'e5f6a7b8-c9d0-1234-efab-345678901234', username: 'PLAYER5', active: false, turnover: 300000 }
])

const downlineStats = computed(() => {
  const total = downlineUsers.value.length
  const active = downlineUsers.value.filter(u => u.active).length
  return { total, active }
})

const totalCommission = ref(125000)

const downlineDetails = ref([
  { id: 'a1b2c3d4...', username: 'PLAYER1', deposit: 500000, turnover: 250000, profit: -30000 },
  { id: 'b2c3d4e5...', username: 'PLAYER2', deposit: 200000, turnover: 120000, profit: 15000 },
  { id: 'c3d4e5f6...', username: 'PLAYER3', deposit: 800000, turnover: 500000, profit: -50000 },
  { id: 'd4e5f6a7...', username: 'PLAYER4', deposit: 100000, turnover: 80000, profit: 20000 },
  { id: 'e5f6a7b8...', username: 'PLAYER5', deposit: 400000, turnover: 300000, profit: -10000 }
])

const searchUsername = ref('')
const filteredDownline = computed(() => {
  if (!searchUsername.value) return []
  return downlineUsers.value.filter(u => u.username.toLowerCase().includes(searchUsername.value.toLowerCase()))
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
