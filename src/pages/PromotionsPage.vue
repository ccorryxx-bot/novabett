<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 pb-20">
    <header class="sticky top-0 z-30 bg-[#0b141a]/80 backdrop-blur-lg border-b border-cyan-500/10 px-4 py-2">
      <h2 class="text-lg font-bold text-center text-cyan-300">Promotions</h2>
    </header>
    <div class="px-4 pt-4 space-y-6">
      
      <!-- Lucky Wheel -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-bold text-cyan-300">🎡 Lucky Wheel</h3>
          <span class="bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full text-sm">{{ spinsLeft }} Spins</span>
        </div>
        <div class="flex justify-center">
          <div class="relative w-48 h-48">
            <!-- Wheel -->
            <div class="w-full h-full rounded-full border-4 border-cyan-500/30 bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-800 shadow-2xl relative overflow-hidden transform transition-transform duration-1000" :class="{ 'rotate-[720deg]': spinning }">
              <span class="absolute top-5 right-5 text-white font-bold text-sm drop-shadow-lg">30K</span>
              <span class="absolute bottom-5 right-5 text-white font-bold text-sm drop-shadow-lg">50K</span>
              <span class="absolute bottom-5 left-5 text-white font-bold text-sm drop-shadow-lg">70K</span>
              <span class="absolute top-5 left-5 text-white font-bold text-sm drop-shadow-lg">100K</span>
            </div>
            <!-- Pointer -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-8 border-r-8 border-t-[16px] border-l-transparent border-r-transparent border-t-cyan-300 drop-shadow-lg z-10"></div>
            <!-- Center Button -->
            <button @click="spinWheel" :disabled="spinning || spinsLeft <= 0" class="absolute inset-0 flex items-center justify-center z-20">
              <span class="text-3xl bg-black/50 rounded-full p-2">🎡</span>
            </button>
          </div>
        </div>
        <div v-if="lastWin" class="text-center mt-3 animate-bounce">
          <p class="text-cyan-400 font-bold">🏆 You won {{ lastWin.toLocaleString() }} Ks!</p>
        </div>
        <div class="mt-3 text-center text-xs text-gray-500">💰 Deposit to earn more spins</div>
      </div>

      <!-- Referral Code -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold text-white text-sm">🤝 Referral Code</h3>
            <p class="text-xs text-gray-500 mt-1">Your Code - <span class="text-cyan-300 font-semibold">{{ referralCode }}</span></p>
          </div>
          <button @click="copyReferral" class="bg-cyan-500/10 text-cyan-300 px-3 py-1.5 rounded-lg text-xs">{{ copied ? 'Copied!✅' : 'Copy' }}</button>
        </div>
        <div class="mt-3 bg-black/20 p-3 rounded-xl space-y-1.5">
          <p class="text-cyan-400 text-xs font-semibold mb-1">🎁 Steps to Get Bonus</p>
          <p class="text-gray-300 text-xs"><span class="bg-cyan-500/20 text-cyan-300 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">1</span> Invite friends.</p>
          <p class="text-gray-300 text-xs"><span class="bg-cyan-500/20 text-cyan-300 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">2</span> They register & play.</p>
          <p class="text-gray-300 text-xs"><span class="bg-cyan-500/20 text-cyan-300 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">3</span> Earn commission based on turnover.</p>
        </div>
      </div>

      <!-- Active Bonuses -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4">🔥 My Bonuses</h3>
        <div v-if="activeBonuses.length > 0" class="space-y-3">
          <div v-for="b in activeBonuses" :key="b.id" class="flex justify-between p-3 bg-black/20 rounded-xl">
            <div><p class="text-sm font-semibold">{{ b.name }}</p><p class="text-xs text-gray-400">{{ b.desc }}</p></div>
            <span class="text-cyan-400 font-bold">+{{ b.amount.toLocaleString() }} Ks</span>
          </div>
        </div>
        <p v-else class="text-center text-gray-500 py-4">No active bonuses</p>
      </div>
    </div>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0b141a]/95 backdrop-blur-xl border-t border-cyan-500/10 z-50 py-2">
      <div class="flex justify-around">
        <router-link to="/home" class="flex flex-col items-center text-gray-500 hover:text-gray-300"><span class="text-lg">🏠</span><span class="text-[10px]">Home</span></router-link>
        <router-link to="/promotions" class="flex flex-col items-center text-cyan-400"><span class="text-lg">🎁</span><span class="text-[10px]">Promos</span></router-link>
        <router-link to="/agent" class="flex flex-col items-center text-gray-500 hover:text-gray-300"><span class="text-lg">👥</span><span class="text-[10px]">Agents</span></router-link>
        <router-link to="/service" class="flex flex-col items-center text-gray-500 hover:text-gray-300"><span class="text-lg">💬</span><span class="text-[10px]">Chat</span></router-link>
        <router-link to="/account" class="flex flex-col items-center text-gray-500 hover:text-gray-300"><span class="text-lg">👤</span><span class="text-[10px]">You</span></router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ... (script logic remains the same as before)
const storedUsername = localStorage.getItem('sb_username') || 'YOURNAME'
const referralCode = computed(() => storedUsername.toUpperCase())

const copied = ref(false)
const copyReferral = () => {
  const link = `https://novabett.com/?dl=${referralCode.value}`
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(() => { copied.value = true; setTimeout(() => copied.value = false, 2000) })
  } else {
    prompt('Copy manually:', link)
  }
}

const spinsLeft = ref(5)
const spinning = ref(false)
const lastWin = ref(null)
const prizes = [30000, 50000, 70000, 100000]

const spinWheel = () => {
  if (spinning.value || spinsLeft.value <= 0) return
  spinning.value = true
  spinsLeft.value--
  setTimeout(() => {
    lastWin.value = prizes[Math.floor(Math.random() * prizes.length)]
    spinning.value = false
  }, 1000)
}

const activeBonuses = ref([
  { id: 1, name: 'First Deposit Bonus', desc: '70% match bonus', amount: 1400 },
  { id: 2, name: 'Lucky Wheel Win', desc: 'Wagering x10', amount: 50000 }
])
</script>
