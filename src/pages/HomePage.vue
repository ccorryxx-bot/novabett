<template>
  <div class="min-h-screen bg-[#05050a] text-gray-100 pb-24 relative overflow-hidden font-sans">
    <!-- Ambient Background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-[-10%] -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <!-- Header -->
    <header class="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-lg shadow-lg flex items-center justify-center">
          <span class="text-black font-black text-xl italic">N</span>
        </div>
        <h1 class="text-lg font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent uppercase">NovaBett</h1>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right mr-2">
          <p class="text-[10px] text-gray-500 uppercase font-bold">Welcome back,</p>
          <p class="text-xs font-bold text-white">{{ username }}</p>
        </div>
        <button @click="$router.push('/service')" class="p-2 bg-white/5 rounded-full border border-white/10">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
      </div>
    </header>

    <main class="relative z-10 px-4 pt-6 space-y-6">
      <!-- Wallet Card (Logic Integrated) -->
      <section class="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Assets</p>
            <h2 class="text-3xl font-black text-white tracking-tight">
              {{ formatCurrency(mainBalance + bonusBalance) }} <span class="text-sm font-medium text-amber-500 ml-1">MMK</span>
            </h2>
          </div>
          <button @click="fetchWallet" class="p-2 bg-white/5 rounded-lg active:rotate-180 transition-transform duration-500">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>
        
        <!-- UX: Core Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button @click="$router.push('/deposit')" class="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-all active:scale-95">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span>DEPOSIT</span>
          </button>
          <button @click="$router.push('/withdraw')" class="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 transition-all active:scale-95">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>WITHDRAW</span>
          </button>
        </div>
      </section>

      <!-- Marquee (Psychological Trigger) -->
      <div class="bg-amber-500/5 border-y border-amber-500/10 py-2 -mx-4 overflow-hidden">
        <div class="flex gap-8 animate-marquee whitespace-nowrap">
          <span v-for="i in 10" :key="i" class="text-[10px] font-bold text-amber-200/60 uppercase">
            Winner: User***{{ 200 + i }} <span class="text-emerald-400">+{{ (i * 12500).toLocaleString() }} Ks</span>
          </span>
        </div>
      </div>

      <!-- Categories Navigation -->
      <div class="flex gap-3 overflow-x-auto no-scrollbar py-2">
        <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id"
          class="px-6 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap font-bold text-xs"
          :class="activeCat === cat.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 text-gray-400'">
          {{ cat.name }}
        </button>
      </div>

      <!-- Hot Game Cards Grid -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1 h-5 bg-amber-500 rounded-full"></div>
            <h3 class="text-lg font-black text-white italic uppercase tracking-tighter">Recommended Games</h3>
          </div>
          <span class="text-[10px] font-black text-amber-500 tracking-widest cursor-pointer">SEE ALL</span>
        </div>

        <div class="grid grid-cols-2 gap-4 pb-10">
          <div v-for="game in filteredGames" :key="game.id" @click="playGame(game)" 
            class="relative group rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 border border-white/5 cursor-pointer active:scale-95 transition-transform">
            <img :src="game.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div class="absolute bottom-3 left-3 right-3">
              <p class="text-[9px] font-black text-amber-500 mb-0.5 uppercase tracking-tighter">{{ game.provider }}</p>
              <p class="text-sm font-black text-white truncate uppercase">{{ game.title }}</p>
            </div>
            <!-- Play Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
               <div class="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl">
                 <svg class="w-6 h-6 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Professional Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-50 px-2 pb-safe">
      <div class="flex justify-around items-center py-3">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" 
          class="flex flex-col items-center gap-1 transition-all duration-300"
          :class="$route.path === item.path ? 'text-amber-400 scale-105' : 'text-gray-500'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="$route.path === item.path ? 2.5 : 1.5">
            <path :d="item.svgPath"></path>
          </svg>
          <span class="text-[9px] font-black uppercase tracking-tighter">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// User & Wallet Logic
const username = ref(localStorage.getItem('sb_username') || 'PLAYER')
const mainBalance = ref(0)
const bonusBalance = ref(0)

const fetchWallet = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', user.id).single()
    if (wallet) {
      mainBalance.value = wallet.main_balance
      bonusBalance.value = wallet.bonus_balance
    }
  } catch (e) { console.error(e) }
}

onMounted(fetchWallet)

// Game Data & Filtering Logic
const activeCat = ref('slots')
const categories = [
  { id: 'slots', name: 'SLOT GAMES' },
  { id: 'live', name: 'LIVE CASINO' },
  { id: 'sport', name: 'SPORTSBOOK' },
  { id: 'fish', name: 'FISHING' }
]

const games = ref([
  { id: 1, cat: 'slots', title: 'Gates of Olympus', provider: 'Pragmatic', image: 'https://placehold.co/400x500/111/gold?text=GATES+OF+OLYMPUS' },
  { id: 2, cat: 'slots', title: 'Sugar Rush', provider: 'Pragmatic', image: 'https://placehold.co/400x500/111/pink?text=SUGAR+RUSH' },
  { id: 3, cat: 'live', title: 'Lightning Roulette', provider: 'Evolution', image: 'https://placehold.co/400x500/111/red?text=ROULETTE' },
  { id: 4, cat: 'sport', title: 'SBO Sports', provider: 'SBOBET', image: 'https://placehold.co/400x500/111/blue?text=SBOBET' }
])

const filteredGames = computed(() => games.value.filter(g => g.cat === activeCat.value))

const playGame = (game) => {
  // Logic to launch game
  alert(`Launching ${game.title}...`)
}

const formatCurrency = (val) => new Intl.NumberFormat().format(val)

// Nav Data
const navItems = [
  { name: 'Lobby', path: '/home', svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Events', path: '/promotions', svgPath: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  { name: 'Partners', path: '/agent', svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { name: 'Support', path: '/service', svgPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Vault', path: '/account', svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-marquee { animation: marquee 30s linear infinite; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>
