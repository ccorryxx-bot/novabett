<template>
  <div class="min-h-screen bg-[#0a0a14] text-white pb-20 relative overflow-hidden">
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 -right-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>

    <header class="sticky top-0 z-30 bg-black/70 backdrop-blur-lg border-b border-white/10 px-4 py-2">
      <h2 class="text-lg font-bold text-center bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">{{ $t('agent') }}</h2>
      <div class="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
        <button v-for="(tab, i) in tabs" :key="i" @click="activeTab = i"
          class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
          :class="activeTab === i ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'">
          {{ tab }}
        </button>
      </div>
    </header>

    <div class="px-4 pt-6 space-y-6 relative z-10">
      <!-- Tab 0: Overview -->
      <div v-if="activeTab === 0">
        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-yellow-300 flex items-center gap-2"><span>🔗</span> Referral Link</h3>
            <button @click="copyReferral" class="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
              {{ copied ? $t('copied') : $t('copy') }}
            </button>
          </div>
          <div class="bg-black/40 rounded-xl p-3 border border-white/5">
            <p class="text-sm text-gray-300 font-mono truncate">{{ referralLink }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center shadow-xl">
            <p class="text-3xl font-black text-yellow-300">{{ downlineStats.total }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $t('totalDownline') }}</p>
          </div>
          <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center shadow-xl">
            <p class="text-3xl font-black text-emerald-400">{{ downlineStats.active }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $t('activeNow') }}</p>
          </div>
        </div>

        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl flex justify-between items-center mt-4">
          <span class="text-gray-400 text-sm">{{ $t('totalCommission') }}</span>
          <span class="text-yellow-300 font-black text-xl">{{ totalCommission.toLocaleString() }} Ks</span>
        </div>

        <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl mt-4">
          <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>👥</span> {{ $t('yourDownline') }}</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-for="user in downlineUsers" :key="user.id" class="flex justify-between items-center p-3 bg-black/30 rounded-xl border border-white/5">
              <div>
                <p class="text-sm font-semibold">{{ user.username }}</p>
                <p class="text-[10px] text-gray-500">ID: {{ user.id.slice(0,8) }}...</p>
              </div>
              <div class="text-right">
                <span :class="user.active ? 'text-emerald-400' : 'text-red-400'" class="text-[10px] font-bold">● {{ user.active ? 'Active' : 'Inactive' }}</span>
                <p class="text-[10px] text-gray-400 mt-0.5">Turnover: {{ user.turnover.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 1: Tutorial -->
      <div v-else-if="activeTab === 1" class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>📘</span> {{ $t('tutorial') }}</h3>
        <div class="bg-black/30 rounded-xl p-4 space-y-3 text-sm text-gray-300">
          <div class="flex items-start gap-2">
            <span class="bg-yellow-500/30 text-yellow-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <p>{{ $t('level1') }}: Total Turnover × <span class="text-yellow-400 font-bold">10%</span></p>
          </div>
          <div class="flex items-start gap-2">
            <span class="bg-yellow-500/30 text-yellow-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <p>{{ $t('level2') }}: (Total Turnover × 10%) × 30% ≈ <span class="text-yellow-400 font-bold">3%</span></p>
          </div>
          <div class="flex items-start gap-2">
            <span class="bg-yellow-500/30 text-yellow-300 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">∞</span>
            <p>{{ $t('unlimited') }}</p>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ $t('winLossBasis') }}</p>
        </div>
      </div>

      <!-- Tab 2: My Data -->
      <div v-else-if="activeTab === 2" class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>📊</span> {{ $t('myData') }}</h3>
        <div class="space-y-3">
          <div class="flex justify-between bg-black/30 p-3 rounded-xl border border-white/5">
            <span class="text-gray-400 text-sm">{{ $t('today') }}</span>
            <span class="text-yellow-300 font-semibold">12,500 Ks</span>
          </div>
          <div class="flex justify-between bg-black/30 p-3 rounded-xl border border-white/5">
            <span class="text-gray-400 text-sm">{{ $t('yesterday') }}</span>
            <span class="text-yellow-300 font-semibold">8,200 Ks</span>
          </div>
          <div class="flex justify-between bg-black/30 p-3 rounded-xl border border-white/5">
            <span class="text-gray-400 text-sm">{{ $t('thisMonth') }}</span>
            <span class="text-yellow-300 font-semibold">145,000 Ks</span>
          </div>
        </div>
      </div>

      <!-- Tab 3: Downline Details -->
      <div v-else-if="activeTab === 3" class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>📋</span> {{ $t('details') }}</h3>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div v-for="user in downlineDetails" :key="user.id" class="bg-black/30 rounded-xl p-3 border border-white/5">
            <p class="text-sm font-semibold mb-2">{{ user.username }}</p>
            <div class="grid grid-cols-3 gap-2 text-[10px]">
              <div><span class="text-gray-500">{{ $t('depositAmt') }}</span><p class="text-white text-xs">{{ user.deposit.toLocaleString() }}</p></div>
              <div><span class="text-gray-500">{{ $t('turnover') }}</span><p class="text-white text-xs">{{ user.turnover.toLocaleString() }}</p></div>
              <div><span class="text-gray-500">{{ $t('profitLoss') }}</span><p :class="user.profit >= 0 ? 'text-emerald-400' : 'text-red-400'" class="text-xs">{{ user.profit.toLocaleString() }}</p></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 4: Search -->
      <div v-else-if="activeTab === 4" class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>🔍</span> {{ $t('searchDownline') }}</h3>
        <input v-model="searchUsername" type="text" :placeholder="$t('searchDownline')" class="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50 mb-4" />
        <div v-if="searchUsername" class="space-y-2">
          <div v-for="user in filteredDownline" :key="user.id" class="bg-black/30 rounded-xl p-3 border border-white/5">
            <p class="text-sm font-semibold">{{ user.username }}</p>
            <p class="text-[10px] text-gray-400">ID: {{ user.id.slice(0,12) }}...</p>
          </div>
          <p v-if="filteredDownline.length === 0" class="text-center text-gray-500 py-4 text-sm">{{ $t('notFound') }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 z-40">
      <div class="flex justify-around items-center py-2">
        <router-link to="/home" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <span class="text-lg">🏠</span><span class="text-[10px]">{{ $t('home') }}</span>
        </router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <span class="text-lg">🎁</span><span class="text-[10px]">{{ $t('promotions') }}</span>
        </router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-0.5 text-yellow-400 transition-colors">
          <span class="text-lg">👥</span><span class="text-[10px]">{{ $t('agent') }}</span>
        </router-link>
        <router-link to="/service" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <span class="text-lg">💬</span><span class="text-[10px]">{{ $t('service') }}</span>
        </router-link>
        <router-link to="/account" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <span class="text-lg">👤</span><span class="text-[10px]">{{ $t('account') }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const activeTab = ref(0)
const tabs = [
  t('overview'),
  t('tutorial'),
  t('myData'),
  t('details'),
  t('searchDL')
]

// ... rest same as before
const storedUsername = localStorage.getItem('sb_username') || 'YOURNAME'
const referralLink = `https://novabett.com/?dl=${storedUsername.toUpperCase()}`

const copied = ref(false)
const copyReferral = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(referralLink).then(() => { copied.value = true; setTimeout(() => copied.value = false, 2000) })
  } else {
    prompt('Copy manually:', referralLink)
  }
}

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
