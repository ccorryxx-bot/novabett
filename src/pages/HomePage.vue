<template>
  <div class="min-h-screen bg-black text-white pb-24 relative">
    <!-- HEADER (transparent, no bg) -->
    <header class="sticky top-0 z-30 flex items-center justify-between px-4 py-3">
      <h1 class="text-xl font-black tracking-tighter">
        <span class="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">NovaBETT</span>
      </h1>
      <div class="flex items-center gap-2">
        <button @click="toggleLanguage" class="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded-full transition-all">
          {{ currentLang === 'en' ? 'MM' : 'EN' }}
        </button>
        <button @click="showDepositModal = true" class="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 active:scale-95 transition-all">ငွေသွင်း</button>
        <button @click="showWithdrawModal = true" class="bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-rose-500/30 active:scale-95 transition-all">ငွေထုတ်</button>
      </div>
    </header>

    <!-- CAROUSEL (unchanged) -->
    <div class="px-4 pt-2 relative">
      <div class="rounded-2xl overflow-hidden relative h-44 bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
        <div class="absolute inset-0 flex transition-transform duration-500" :style="{ transform: `translateX(-${carouselIndex * 100}%)` }">
          <div v-for="(img, i) in carouselImages" :key="i" class="w-full h-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-white/30" :style="{ background: img.color }">
            <span class="text-white/60 text-sm">{{ img.title }}</span>
          </div>
        </div>
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          <button v-for="(img, i) in carouselImages" :key="i" @click="carouselIndex = i" class="w-2 h-2 rounded-full transition-all" :class="i === carouselIndex ? 'bg-yellow-400 w-4' : 'bg-white/40'"></button>
        </div>
        <button @click="prevSlide" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
        <button @click="nextSlide" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
      </div>
    </div>

    <!-- JACKPOT BANNER (kept clean) -->
    <div class="mx-4 mt-3 relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-xl blur-md opacity-75 animate-pulse"></div>
      <div class="relative bg-black/80 backdrop-blur-xl rounded-xl border border-yellow-500/30 px-4 py-4 overflow-hidden shadow-2xl">
        <div class="relative z-10">
          <p class="text-yellow-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">MEGA JACKPOT</p>
          <div class="text-4xl font-black text-yellow-200 tracking-tighter leading-none mb-2 tabular-nums">K {{ displayedJackpot }}</div>
          <div class="flex justify-between items-center">
            <span class="bg-yellow-500/20 text-yellow-300 text-[9px] font-bold px-2 py-0.5 rounded-full">Dragon Fortune Mega</span>
            <div class="flex gap-2"><span class="bg-red-500/20 text-red-300 text-[9px] font-bold px-2 py-0.5 rounded-full">RTP 96.5%</span><span class="bg-purple-500/20 text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded-full">VOL HIGH</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SEARCH -->
    <div class="px-4 pt-4">
      <input v-model="searchQuery" type="text" placeholder="Search games..." class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 transition-all text-sm" />
    </div>

    <!-- CATEGORIES -->
    <div class="px-4 pt-4 pb-3">
      <div class="flex gap-2 overflow-x-auto no-scrollbar">
        <button v-for="cat in categories" :key="cat" @click="activeCategory = cat" class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border" :class="activeCategory === cat ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-transparent shadow-lg shadow-yellow-500/20' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'">{{ cat }}</button>
      </div>
    </div>

    <!-- GAME CARDS -->
    <div class="px-4">
      <div class="grid grid-cols-3 gap-2.5">
        <div v-for="game in filteredGames" :key="game.id" @click="openGame(game)" class="group bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden active:scale-95 transition-all cursor-pointer hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/10">
          <div class="relative w-full aspect-square bg-black/40 flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-purple-500/5"></div>
            <span class="absolute top-1 left-1 z-20 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[8px] font-bold text-yellow-400">{{ game.provider }}</span>
            <div class="relative z-10 text-4xl opacity-40 group-hover:scale-110 transition-transform duration-500">🎰</div>
          </div>
          <div class="p-2"><h3 class="text-[11px] font-semibold leading-tight truncate">{{ game.name }}</h3></div>
        </div>
      </div>
    </div>

    <!-- FOOTER (Terms, etc. placeholder) -->
    <div class="px-4 mt-8 text-center text-xs text-gray-500">
      <p>&copy; 2026 NovaBETT. All rights reserved.</p>
      <div class="flex justify-center gap-4 mt-2">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Contact Us</span>
      </div>
    </div>

    <!-- BOTTOM NAV (transparent, no bg) -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 py-2">
      <div class="flex justify-around items-center">
        <router-link to="/home" class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors" :class="$route.path === '/home' ? 'text-yellow-400' : 'text-gray-400'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span class="text-[10px]">{{ $t('home') }}</span>
        </router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors" :class="$route.path === '/promotions' ? 'text-yellow-400' : 'text-gray-400'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12v8H4v-8l8-8 8 8zm-2 2H6v4h12v-4zM12 2l-8 8h16l-8-8z"/></svg>
          <span class="text-[10px]">{{ $t('promotions') }}</span>
        </router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors" :class="$route.path === '/agent' ? 'text-yellow-400' : 'text-gray-400'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span class="text-[10px]">{{ $t('agent') }}</span>
        </router-link>
        <router-link to="/service" class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors" :class="$route.path === '/service' ? 'text-yellow-400' : 'text-gray-400'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span class="text-[10px]">{{ $t('service') }}</span>
        </router-link>
        <router-link to="/account" class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors" :class="$route.path === '/account' ? 'text-yellow-400' : 'text-gray-400'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span class="text-[10px]">{{ $t('account') }}</span>
        </router-link>
      </div>
    </nav>

    <DepositModal v-model="showDepositModal" @submit="handleDepositSubmit" />
    <WithdrawModal v-model="showWithdrawModal" :balance="userBalance" @submit="handleWithdrawSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DepositModal from '@/components/DepositModal.vue'
import WithdrawModal from '@/components/WithdrawModal.vue'

const { locale, t } = useI18n()
const currentLang = ref(locale.value)

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'mm' : 'en'
  currentLang.value = locale.value
  localStorage.setItem('lang', locale.value)
}

const userBalance = ref(50000)
const jackpot = ref(893619157998)
const displayedJackpot = ref('893,619,157,998')
const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num)

onMounted(() => {
  setInterval(() => {
    const inc = Math.floor(Math.random() * 500000 + 100000)
    jackpot.value += inc
    animateValue(jackpot.value - inc, jackpot.value)
  }, 5000)
  const savedLang = localStorage.getItem('lang')
  if (savedLang) {
    locale.value = savedLang
    currentLang.value = savedLang
  }
})

function animateValue(start, end) {
  let current = start
  const range = end - start, dur = 800, stepTime = 20
  const steps = dur / stepTime, inc = range / steps
  let step = 0
  const timer = setInterval(() => {
    current += inc
    if (step >= steps) { current = end; clearInterval(timer) }
    displayedJackpot.value = formatNumber(Math.floor(current))
    step++
  }, stepTime)
}

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

const searchQuery = ref('')
const activeCategory = ref('All')
const categories = ref(['All', 'JILI', 'PP', 'PG', 'Pragmatic', 'Live', 'Fishing'])
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

const openGame = async (game) => {
  alert(`Opening ${game.name}`)
}

const showDepositModal = ref(false)
const showWithdrawModal = ref(false)
const handleDepositSubmit = (data) => console.log('Deposit:', data)
const handleWithdrawSubmit = (data) => console.log('Withdraw:', data)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
@keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
.animate-shimmer { background-size: 200% auto; animation: shimmer 3s linear infinite; }
</style>
