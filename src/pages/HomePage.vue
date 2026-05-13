<template>
  <div class="min-h-screen bg-[#05050a] text-gray-100 pb-24 relative overflow-hidden font-sans">
    <!-- Ambient Background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-[-10%] -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <!-- Header Section -->
    <header class="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-lg shadow-lg flex items-center justify-center">
          <span class="text-black font-black text-xl italic">N</span>
        </div>
        <h1 class="text-lg font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent uppercase">NovaBett</h1>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right mr-1">
          <p class="text-[9px] text-gray-500 uppercase font-black">Level VIP {{ vipLevel }}</p>
          <p class="text-xs font-bold text-white">{{ username }}</p>
        </div>
        <button @click="$router.push('/account')" class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center overflow-hidden">
          <span class="font-black text-amber-500 text-sm">{{ username.charAt(0) }}</span>
        </button>
      </div>
    </header>

    <main class="relative z-10 px-4 pt-6 space-y-6">
      <!-- Balance Engine -->
      <section class="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.45 12.1l-2.02 2.02c-.39.39-1.02.39-1.41 0L7.45 13.5c-.39-.39-.39-1.02 0-1.41l2.02-2.02c.39-.39 1.02-.39 1.41 0l2.57 2.57 2.57-2.57c.39-.39 1.02-.39 1.41 0l2.02 2.02c.39.39.39 1.02 0 1.41L13.45 14.1z"/></svg>
        </div>
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Available Credits</p>
            <h2 class="text-4xl font-black text-white tracking-tight">
              {{ formatCurrency(mainBalance + bonusBalance) }} <span class="text-xs font-medium text-amber-500 ml-1">MMK</span>
            </h2>
          </div>
          <button @click="fetchWallet" class="p-2 bg-white/5 rounded-xl border border-white/10 active:rotate-180 transition-transform duration-500">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <button @click="$router.push('/deposit')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-yellow-500/20">
            <span>RECHARGE</span>
          </button>
          <button @click="$router.push('/withdraw')" class="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 transition-all active:scale-95">
            <span>CASHOUT</span>
          </button>
        </div>
      </section>

      <!-- Category Switcher (The Engine) -->
      <section>
        <div class="flex gap-3 overflow-x-auto no-scrollbar py-2">
          <button v-for="cat in categories" :key="cat.id" 
            @click="switchCategory(cat.id)"
            class="px-6 py-4 rounded-2xl border transition-all duration-300 whitespace-nowrap font-black text-[10px] tracking-widest uppercase"
            :class="activeCat === cat.id ? 'bg-amber-500 text-black border-amber-500 shadow-xl shadow-amber-500/20 translate-y-[-2px]' : 'bg-white/5 border-white/10 text-gray-500'">
            {{ cat.name }}
          </button>
        </div>
      </section>

      <!-- Dynamic Content Area -->
      <section class="min-h-[400px]">
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
          <div class="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <p class="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Fetching Games...</p>
        </div>

        <div v-else>
          <!-- Category Title -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              <h3 class="text-xl font-black text-white italic uppercase tracking-tighter">{{ getActiveCatName() }}</h3>
            </div>
            <p class="text-[9px] font-black text-gray-500 tracking-widest">{{ filteredGames.length }} TITLES</p>
          </div>

          <!-- Responsive Game Grid -->
          <div class="grid grid-cols-2 gap-4 pb-10">
            <div v-for="game in filteredGames" :key="game.id" 
              @click="handleLaunchGame(game)"
              class="relative group rounded-3xl overflow-hidden aspect-[4/5] bg-gray-900 border border-white/5 cursor-pointer active:scale-95 transition-all">
              
              <img :src="game.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
              
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
              
              <!-- Bottom Info -->
              <div class="absolute bottom-4 left-4 right-4">
                <div class="flex items-center gap-1.5 mb-1">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p class="text-[8px] font-black text-amber-500 uppercase tracking-tighter">{{ game.provider }}</p>
                </div>
                <p class="text-sm font-black text-white truncate uppercase leading-tight">{{ game.title }}</p>
              </div>

              <!-- Professional Play Button Overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 backdrop-blur-[3px]">
                <div class="px-6 py-2 bg-amber-500 text-black font-black text-xs rounded-full shadow-2xl tracking-widest">
                  PLAY NOW
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Professional Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-3xl border-t border-white/5 z-50 px-2 pb-safe">
      <div class="flex justify-around items-center py-4">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" 
          class="flex flex-col items-center gap-1.5 transition-all duration-300"
          :class="$route.path === item.path ? 'text-amber-400 scale-105' : 'text-gray-600'">
          <div :class="$route.path === item.path ? 'bg-amber-500/10 p-2 rounded-xl border border-amber-500/20' : ''">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="$route.path === item.path ? 2.5 : 1.5">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.svgPath"></path>
            </svg>
          </div>
          <span class="text-[8px] font-black uppercase tracking-[0.1em]">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// Profile Logic
const username = ref(localStorage.getItem('sb_username') || 'PLAYER')
const mainBalance = ref(0)
const bonusBalance = ref(0)
const vipLevel = ref(1)
const loading = ref(false)

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

// Category Navigation Engine
const activeCat = ref('slots')
const categories = [
  { id: 'slots', name: 'SLOT MACHINES' },
  { id: 'live', name: 'LIVE CASINO' },
  { id: 'sport', name: 'SPORTSBOOK' },
  { id: 'fish', name: 'FISHING HUB' }
]

const switchCategory = (id) => {
  if (activeCat.value === id) return
  loading.value = true
  activeCat.value = id
  // Simulate API fetch delay for professional feel
  setTimeout(() => { loading.value = false }, 400)
}

const getActiveCatName = () => {
  return categories.find(c => c.id === activeCat.value)?.name || ''
}

// Game Data (In real world, fetch from DB based on category)
const games = ref([
  { id: 1, cat: 'slots', title: 'Gates of Olympus', provider: 'Pragmatic', image: 'https://placehold.co/400x500/111/gold?text=GATES+OF+OLYMPUS' },
  { id: 2, cat: 'slots', title: 'Sugar Rush', provider: 'Pragmatic', image: 'https://placehold.co/400x500/111/pink?text=SUGAR+RUSH' },
  { id: 3, cat: 'live', title: 'Lightning Roulette', provider: 'Evolution', image: 'https://placehold.co/400x500/111/red?text=ROULETTE' },
  { id: 4, cat: 'sport', title: 'SBO Sports', provider: 'SBOBET', image: 'https://placehold.co/400x500/111/blue?text=SBOBET' },
  { id: 5, cat: 'fish', title: 'Jili Fishing', provider: 'JILI', image: 'https://placehold.co/400x500/111/cyan?text=FISHING' }
])

const filteredGames = computed(() => games.value.filter(g => g.cat === activeCat.value))

const handleLaunchGame = (game) => {
  // Add launch logic here (e.g. redirect to game URL or open modal)
  console.log(`Launching: ${game.title} via ${game.provider}`)
}

const formatCurrency = (val) => new Intl.NumberFormat().format(val)

// Nav Items
const navItems = [
  { name: 'Home', path: '/home', svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Promos', path: '/promotions', svgPath: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  { name: 'Agent', path: '/agent', svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { name: 'Support', path: '/service', svgPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Profile', path: '/account', svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
</style>
