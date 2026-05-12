<template>
  <div class="min-h-screen bg-[#0a0a14] text-white pb-20">
    <header class="sticky top-0 z-30 bg-black/70 backdrop-blur-lg border-b border-white/10 px-4 py-2">
      <h2 class="text-lg font-bold text-center">{{ $t('promotions') }}</h2>
    </header>
    <div class="px-4 pt-4 space-y-6">
      
      <!-- Lucky Wheel -->
      <div class="bg-white/5 rounded-2xl p-5">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-bold text-yellow-300">{{ $t('luckyWheel') }}</h3>
          <span class="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">{{ spinsLeft }} {{ $t('spinsLeft') }}</span>
        </div>
        <div class="flex justify-center">
          <div class="relative w-48 h-48">
            <div class="w-full h-full rounded-full border-4 border-yellow-500/50 bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 shadow-2xl relative overflow-hidden transform transition-transform duration-1000" :class="{ 'rotate-[720deg]': spinning }">
              <span class="absolute top-5 right-5 text-white font-bold text-sm drop-shadow-lg">၃သောင်း🤔</span>
              <span class="absolute bottom-5 right-5 text-white font-bold text-sm drop-shadow-lg">၅သောင်း🤔</span>
              <span class="absolute bottom-5 left-5 text-white font-bold text-sm drop-shadow-lg">၇သောင်း🤔</span>
              <span class="absolute top-5 left-5 text-white font-bold text-sm drop-shadow-lg">၁သိန်း🤔</span>
            </div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-8 border-r-8 border-t-[16px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg z-10"></div>
            <button @click="spinWheel" :disabled="spinning || spinsLeft <= 0" class="absolute inset-0 flex items-center justify-center z-20">
              <span class="text-3xl bg-black/50 rounded-full p-2">🎡</span>
            </button>
          </div>
        </div>
        <div v-if="lastWin" class="text-center mt-3 animate-bounce">
          <p class="text-emerald-400 font-bold">🏆 You won {{ lastWin.toLocaleString() }} Ks!</p>
        </div>
      </div>

      <!-- Promo Code -->
      <div class="bg-white/5 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-3">{{ $t('promoCode') }}</h3>
        <div class="flex gap-2">
          <input v-model="promoCode" type="text" :placeholder="$t('enterCode')" class="flex-1 p-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 text-sm uppercase" @input="promoCode = promoCode.toUpperCase()" />
          <button @click="claimPromo" :disabled="!promoCode" class="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl active:scale-95 disabled:opacity-40">{{ $t('claim') }}</button>
        </div>
        <p v-if="promoMessage" class="text-sm mt-2" :class="promoSuccess ? 'text-emerald-400' : 'text-red-400'">{{ promoMessage }}</p>
      </div>

      <!-- Referral Code -->
      <div class="bg-white/5 rounded-2xl p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold text-white text-sm">{{ $t('referralCode') }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ $t('yourReferralCode') }} - <span class="text-yellow-300 font-semibold">{{ referralCode }}</span></p>
          </div>
          <button @click="copyReferral" class="bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg text-xs">{{ copied ? $t('copied') : $t('copy') }}</button>
        </div>
        <div class="mt-3 bg-black/30 p-3 rounded-xl space-y-1.5">
          <p class="text-yellow-400 text-xs font-semibold mb-1">{{ $t('steps') }}</p>
          <p class="text-gray-300 text-xs"><span class="bg-yellow-500/30 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">1</span> {{ $t('step1') }}</p>
          <p class="text-gray-300 text-xs"><span class="bg-yellow-500/30 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">2</span> {{ $t('step2') }}</p>
          <p class="text-gray-300 text-xs"><span class="bg-yellow-500/30 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px] mr-1.5">3</span> {{ $t('step3') }}</p>
        </div>
      </div>

      <!-- Active Bonuses -->
      <div class="bg-white/5 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4">{{ $t('myBonuses') }}</h3>
        <div v-if="activeBonuses.length > 0" class="space-y-3">
          <div v-for="b in activeBonuses" :key="b.id" class="flex justify-between p-3 bg-black/30 rounded-xl">
            <div><p class="text-sm font-semibold">{{ b.name }}</p><p class="text-xs text-gray-400">{{ b.desc }}</p></div>
            <span class="text-yellow-400 font-bold">+{{ b.amount.toLocaleString() }} Ks</span>
          </div>
        </div>
        <p v-else class="text-center text-gray-500 py-4">{{ $t('noActiveBonuses') }}</p>
      </div>
    </div>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 py-2">
      <div class="flex justify-around">
        <router-link to="/home" class="text-gray-400 flex flex-col items-center"><span class="text-lg">🏠</span><span class="text-[10px]">{{ $t('home') }}</span></router-link>
        <router-link to="/promotions" class="text-yellow-400 flex flex-col items-center"><span class="text-lg">🎁</span><span class="text-[10px]">{{ $t('promotions') }}</span></router-link>
        <router-link to="/agent" class="text-gray-400 flex flex-col items-center"><span class="text-lg">👥</span><span class="text-[10px]">{{ $t('agent') }}</span></router-link>
        <router-link to="/service" class="text-gray-400 flex flex-col items-center"><span class="text-lg">💬</span><span class="text-[10px]">{{ $t('service') }}</span></router-link>
        <router-link to="/account" class="text-gray-400 flex flex-col items-center"><span class="text-lg">👤</span><span class="text-[10px]">{{ $t('account') }}</span></router-link>
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

const promoCode = ref('')
const promoMessage = ref('')
const promoSuccess = ref(false)
const claimPromo = () => {
  if (!promoCode.value) return
  promoSuccess.value = true
  promoMessage.value = 'Code claimed! Bonus added.'
  promoCode.value = ''
  setTimeout(() => { promoMessage.value = '' }, 3000)
}

const activeBonuses = ref([
  { id: 1, name: 'First Deposit Bonus', desc: '70% match bonus', amount: 1400 },
  { id: 2, name: 'Lucky Wheel Win', desc: 'Wagering x10', amount: 50000 }
])
</script>
