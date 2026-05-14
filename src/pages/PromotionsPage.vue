<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 pb-20">
    <header class="sticky top-0 z-30 bg-[#0b141a]/80 backdrop-blur-lg border-b border-cyan-500/10 px-4 py-2">
      <h2 class="text-lg font-bold text-center text-cyan-300">Promotions</h2>
    </header>
    <div class="px-4 pt-4 space-y-6">
      
      <!-- Lucky Wheel -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-bold text-cyan-300">Lucky Wheel</h3>
          <span class="bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full text-sm">{{ spinsLeft }} Spins</span>
        </div>

        <!-- Wheel Container -->
        <div class="flex justify-center my-6">
          <div class="relative w-56 h-56">
            <!-- Outer glow ring -->
            <div class="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            
            <!-- Wheel (6 segments) -->
            <div ref="wheelEl" class="w-full h-full rounded-full bg-transparent border-4 border-cyan-500/50 shadow-2xl relative flex items-center justify-center transition-transform duration-[2000ms] ease-out overflow-hidden"
              :style="{ transform: `rotate(${wheelRotation}deg)` }">
              
              <!-- Conic gradient for 6 segments:
                   Segments: 30K (0-60deg), 50K (60-120), 70K (120-180), 100K (180-240), Empty (240-300), Empty (300-360) -->
              <div class="absolute inset-0" style="background: conic-gradient(
                #00bcd4 0deg 60deg,
                #00838f 60deg 120deg,
                #00bcd4 120deg 180deg,
                #006064 180deg 240deg,
                #37474f 240deg 300deg,
                #455a64 300deg 360deg
              );"></div>
              
              <!-- Labels (inside wheel) -->
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="top:15%; right:20%; transform: rotate(30deg);">30K</span>
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="bottom:15%; right:20%; transform: rotate(-30deg);">50K</span>
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="bottom:15%; left:20%; transform: rotate(30deg);">70K</span>
              <span class="absolute text-white font-bold text-xs drop-shadow-lg" style="top:15%; left:20%; transform: rotate(-30deg);">100K</span>
              <!-- Empty markers -->
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

        <!-- Result message (only if server-side returns win) -->
        <div v-if="lastWin" class="text-center mt-3 animate-bounce">
          <p class="text-cyan-400 font-bold text-lg">You won {{ lastWin.toLocaleString() }} Ks!</p>
          <p class="text-gray-400 text-xs">Wagering x10 required</p>
        </div>

        <div class="mt-4 text-center text-xs text-gray-500">
          Deposit to earn more spins
        </div>
      </div>

      <!-- Referral Code -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold text-white text-sm">Referral Code</h3>
            <p class="text-xs text-gray-500 mt-1">Your Code - <span class="text-cyan-300 font-semibold">{{ referralCode }}</span></p>
          </div>
          <button @click="copyReferral" class="bg-cyan-500/10 text-cyan-300 px-3 py-1.5 rounded-lg text-xs">{{ copied ? 'Copied!' : 'Copy' }}</button>
        </div>
        <div class="mt-3 bg-black/20 p-3 rounded-xl space-y-1.5">
          <p class="text-cyan-400 text-xs font-semibold mb-1">Steps to Get Bonus</p>
          <p class="text-gray-300 text-xs"><span class="bg-cyan-500/20 text-cyan-300 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">1</span> Invite friends.</p>
          <p class="text-gray-300 text-xs"><span class="bg-cyan-500/20 text-cyan-300 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">2</span> They register & play.</p>
          <p class="text-gray-300 text-xs"><span class="bg-cyan-500/20 text-cyan-300 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">3</span> Earn commission based on turnover.</p>
        </div>
      </div>

      <!-- Active Bonuses (No mock data) -->
      <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4">My Bonuses</h3>
        <div class="text-center text-gray-500 py-4">
          <p>No active bonuses yet.</p>
          <p class="text-xs mt-1">Deposit to claim your first bonus!</p>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0b141a]/95 backdrop-blur-xl border-t border-cyan-500/10 z-50 py-2">
      <div class="flex justify-around items-center">
        <router-link to="/home" class="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg><span class="text-[10px]">Home</span></router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-1 text-cyan-400"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12v8H4v-8l8-8 8 8zm-2 2H6v4h12v-4zM12 2l-8 8h16l-8-8z"/></svg><span class="text-[10px]">Promos</span></router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg><span class="text-[10px]">Agents</span></router-link>
        <router-link to="/service" class="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg><span class="text-[10px]">Chat</span></router-link>
        <router-link to="/account" class="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg><span class="text-[10px]">You</span></router-link>
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

// Lucky Wheel - server-side will determine wins, for now just spin animation
const spinsLeft = ref(0) // Start with 0 spins; spins are earned via deposit (to be implemented)
const spinning = ref(false)
const lastWin = ref(null)
const wheelRotation = ref(0)

const spinWheel = () => {
  if (spinning.value || spinsLeft.value <= 0) return
  spinning.value = true
  spinsLeft.value--

  // Random spin for animation effect (still client-side for animation, but win will be server-side later)
  const winIndex = Math.floor(Math.random() * 6)
  const segmentCenter = 30 + winIndex * 60
  const currentMod = wheelRotation.value % 360
  let delta = segmentCenter - currentMod
  if (delta < 0) delta += 360
  const finalRotation = wheelRotation.value + 360 * 5 + delta
  wheelRotation.value = finalRotation

  // Placeholder for server-side determination (to be integrated)
  setTimeout(() => {
    // For now, no real win; server will set lastWin after processing
    spinning.value = false
    // lastWin.value = null (server will emit via realtime or we call an edge function)
  }, 2000)
}

// No active bonuses (real data will come from backend)
</script>
