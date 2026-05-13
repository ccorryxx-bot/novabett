<template>
  <div class="min-h-screen bg-[#05050a] text-gray-100 pb-24 relative overflow-hidden font-sans">
    <!-- Background Ambient Glows -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-[-10%] -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <!-- Professional Header -->
    <header class="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center">
          <span class="text-black font-black text-xl italic">N</span>
        </div>
        <h1 class="text-lg font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent uppercase">NovaBett</h1>
      </div>
      <div class="flex items-center gap-4">
        <button class="relative p-1">
          <div class="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 border border-black"></div>
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
      </div>
    </header>

    <main class="relative z-10 px-4 pt-6 space-y-8">
      <!-- Premium Asset Card -->
      <section class="relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-700 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div class="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-[0.2em] mb-1">Total Assets</p>
              <h2 class="text-4xl font-black text-white tracking-tight">
                {{ formatCurrency(totalBalance) }} <span class="text-sm font-medium text-amber-500 ml-1">MMK</span>
              </h2>
            </div>
            <div class="bg-white/5 p-2 rounded-xl border border-white/10">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          
          <!-- Quick Action Bar: UX Optimized -->
          <div class="grid grid-cols-2 gap-3">
            <button @click="$router.push('/deposit')" class="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>Deposit</span>
            </button>
            <button @click="$router.push('/withdraw')" class="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl border border-white/10 transition-all active:scale-95">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Live Win Ticker: Psychological Trigger -->
      <div class="bg-emerald-500/5 border-y border-emerald-500/10 py-2 -mx-4 overflow-hidden">
        <div class="flex gap-8 animate-marquee whitespace-nowrap">
          <span v-for="i in 5" :key="i" class="text-[10px] font-bold text-emerald-400 flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            USER***{{ 1000 + i }} JUST WON {{ (Math.random() * 500000).toFixed(0) }} KS IN SLOTS
          </span>
        </div>
      </div>

      <!-- Categories Navigation -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400">Gaming Floor</h3>
          <span class="text-[10px] text-amber-500 font-bold">VIEW ALL</span>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="cat in categories" :key="cat.name" class="flex flex-col items-center gap-2 group cursor-pointer">
            <div class="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all group-hover:border-amber-500/50">
              <component :is="cat.icon" class="w-6 h-6 text-gray-300 group-hover:text-amber-400" />
            </div>
            <span class="text-[10px] font-bold text-gray-500 group-hover:text-white uppercase">{{ cat.name }}</span>
          </div>
        </div>
      </section>

      <!-- Hot Games Grid -->
      <section class="pb-10">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-4 bg-amber-500 rounded-full"></div>
          <h3 class="text-lg font-black text-white italic">HOT SELECTION</h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="game in hotGames" :key="game.id" class="relative group rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 border border-white/5">
            <img :src="game.image" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div class="absolute bottom-3 left-3 right-3">
              <p class="text-[10px] font-bold text-amber-500 mb-0.5 uppercase tracking-tighter">{{ game.provider }}</p>
              <p class="text-sm font-black text-white truncate uppercase">{{ game.title }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Professional Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-white/10 z-50 px-2">
      <div class="flex justify-around items-center py-3">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" 
          class="flex flex-col items-center gap-1 transition-all duration-300"
          :class="$route.path === item.path ? 'text-amber-400 scale-110' : 'text-gray-500 hover:text-gray-300'">
          <component :is="item.icon" class="w-6 h-6" :stroke-width="$route.path === item.path ? 2.5 : 2" />
          <span class="text-[9px] font-black uppercase tracking-tighter">{{ item.name }}</span>
          <div v-if="$route.path === item.path" class="w-1 h-1 bg-amber-400 rounded-full mt-0.5"></div>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const totalBalance = ref(1250000)
const formatCurrency = (val) => new Intl.NumberFormat().format(val)

const categories = [
  { name: 'Slots', icon: 'LayoutGridIcon' },
  { name: 'Live', icon: 'VideoIcon' },
  { name: 'Sports', icon: 'TrophyIcon' },
  { name: 'Fish', icon: 'WavesIcon' }
]

const hotGames = [
  { id: 1, title: 'Gates of Olympus', provider: 'Pragmatic Play', image: 'https://placehold.co/400x500/111/gold?text=GATES+OF+OLYMPUS' },
  { id: 2, title: 'Sugar Rush', provider: 'Pragmatic Play', image: 'https://placehold.co/400x500/111/pink?text=SUGAR+RUSH' }
]

const navItems = [
  { name: 'Lobby', path: '/home', icon: 'HomeIcon' },
  { name: 'Events', path: '/promotions', icon: 'GiftIcon' },
  { name: 'Partners', path: '/agent', icon: 'UsersIcon' },
  { name: 'Support', path: '/service', icon: 'HeadsetIcon' },
  { name: 'Vault', path: '/account', icon: 'UserIcon' }
]
</script>

<style scoped>
.animate-marquee {
  animation: marquee 25s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
