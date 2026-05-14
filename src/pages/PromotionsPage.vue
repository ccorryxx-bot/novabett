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

        <!-- Wheel Container -->
        <div class="flex justify-center my-6">
          <div class="relative w-56 h-56">
            <!-- Outer glow ring -->
            <div class="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            
            <!-- Wheel itself (6 segments) -->
            <div ref="wheelEl" class="w-full h-full rounded-full bg-transparent border-4 border-cyan-500/50 shadow-2xl relative flex items-center justify-center transition-transform duration-[2000ms] ease-out overflow-hidden"
              :style="{ transform: `rotate(${wheelRotation}deg)` }">
              
              <!-- Segment 1: 30K (top-right area) -->
              <div class="absolute inset-0" style="background: conic-gradient(from 0deg, #00bcd4 0deg 60deg, #00838f 60deg 120deg, #00bcd4 120deg 180deg, #006064 180deg 240deg, #00bcd4 240deg 300deg, #00838f 300deg 360deg);"></div>
              
              <!-- Labels positioned at center of each segment -->
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="top:15%; right:20%; transform: rotate(30deg);">30K</span>
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="bottom:15%; right:20%; transform: rotate(-30deg);">50K</span>
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="bottom:15%; left:20%; transform: rotate(30deg);">70K</span>
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="top:15%; left:20%; transform: rotate(-30deg);">100K</span>
              <!-- Empty segments (top-left and bottom-right) -->
              <span class="absolute text-gray-400 font-bold text-[10px]" style="top:30%; right:8%; transform: rotate(60deg);">Empty</span>
              <span class="absolute text-gray-400 font-bold text-[10px]" style="bottom:30%; left:8%; transform: rotate(-60deg);">Empty</span>
            </div>
            
            <!-- Pointer triangle (fixed) -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-[16px] border-l-transparent border-r-transparent border-t-cyan-300 drop-shadow-lg z-10"></div>
            
            <!-- Spin button (center) -->
            <button @click="spinWheel" :disabled="spinning || spinsLeft <= 0" class="absolute inset-0 z-20 flex items-center justify-center">
              <span class="text-3xl bg-black/50 rounded-full p-3">🎡</span>
            </button>
          </div>
        </div>

        <!-- Win message -->
        <div v-if="lastWin" class="text-center mt-3 animate-bounce">
          <p class="text-cyan-400 font-bold text-lg">🏆 You won {{ lastWin.toLocaleString() }} Ks!</p>
          <p class="text-gray-400 text-xs">Wagering x10 required</p>
        </div>

        <div class="mt-4 text-center text-xs text-gray-500">
          💰 ငွေသွင်းတိုင်း Spin ထပ်ရမည်
        </div>
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

// Lucky Wheel
const spinsLeft = ref(5)
const spinning = ref(false)
const lastWin = ref(null)
const wheelRotation = ref(0)

// Prizes mapping for 6 segments (0 to 5)
// Segment index: 0 = 30K, 1 = 50K, 2 = 70K, 3 = 100K, 4 = Empty, 5 = Empty
const prizes = [30000, 50000, 70000, 100000, 0, 0] // 0 means empty

const spinWheel = () => {
  if (spinning.value || spinsLeft.value <= 0) return
  spinning.value = true
  spinsLeft.value--

  // Random win index (0-5)
  const winIndex = Math.floor(Math.random() * 6)
  
  // Calculate rotation to land on that segment
  // Each segment is 60 degrees. Segment 0 starts at -30 degrees? Let's make segment 0 at top (pointer points to top).
  // With conic-gradient we defined from 0deg, so segment 0 is from 0 to 60deg (right side? Actually conic from 0deg starts at 3 o'clock, but we'll just make the pointer at top and map accordingly.
  // Simpler: we'll rotate wheel so that the winning segment aligns with the pointer (top).
  // If we want segment 0 (30K) at top when rotation = 0, we need to rotate wheel so that its label appears at top.
  // We can just compute a target angle that brings segment `winIndex` to the top. Since we have 6 segments, each 60deg.
  // Segment 0's center is at 30deg from the start? We'll just use a base offset.
  // We'll calculate final rotation = currentRotation + 5 full spins + (targetAngle - currentMod + 360) % 360
  const segmentCenter = 30 + winIndex * 60 // center angle of segment (from 0deg line, clockwise)
  const currentMod = wheelRotation.value % 360
  let delta = segmentCenter - currentMod
  if (delta < 0) delta += 360
  // Add 5 full rotations for dramatic effect
  const finalRotation = wheelRotation.value + 360 * 5 + delta
  wheelRotation.value = finalRotation

  // After animation, set win
  setTimeout(() => {
    const prize = prizes[winIndex]
    if (prize > 0) {
      lastWin.value = prize
    } else {
      lastWin.value = null
      // Optionally show "No luck" message
    }
    spinning.value = false
  }, 2000)
}

// Mock bonuses
const activeBonuses = ref([
  { id: 1, name: 'First Deposit Bonus', desc: '70% match bonus', amount: 1400 },
  { id: 2, name: 'Lucky Wheel Win', desc: 'Wagering x10', amount: 50000 }
])
</script>
