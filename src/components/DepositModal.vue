<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" @click.self="close">
        <div class="bg-[#141428] border border-white/10 rounded-t-2xl w-full sm:max-w-md p-5 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
          
          <div v-if="step === 1">
            <h2 class="text-lg font-bold text-white mb-4">ငွေသွင်းရန်</h2>
            <label class="block text-gray-400 text-xs mb-2 ml-1">နည်းလမ်းရွေးပါ</label>
            <div class="flex gap-2 mb-5">
              <button @click="method = 'wave'" :class="method === 'wave' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 py-3 rounded-xl border font-semibold text-sm">🌊 WavePay</button>
              <button @click="method = 'kpay'" :class="method === 'kpay' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 py-3 rounded-xl border font-semibold text-sm">💳 KBZ Pay</button>
            </div>
            <label class="block text-gray-400 text-xs mb-2 ml-1">ငွေပမာဏ</label>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <button v-for="amt in amountPresets" :key="amt" @click="amount = amt" :class="amount === amt ? 'bg-yellow-500 text-black font-bold' : 'bg-white/5 border border-white/10 text-gray-300'" class="py-2.5 rounded-xl text-sm active:scale-95">{{ amt.toLocaleString() }}</button>
            </div>
            <input v-model.number="amount" type="number" placeholder="စိတ်ကြိုက်ပမာဏ" class="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50" />
            <div v-if="amount > 0" class="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <p class="text-yellow-300 text-xs font-medium">🎁 70% ဘောနပ်</p>
              <p class="text-white text-sm font-semibold mt-1">+{{ bonusAmount.toLocaleString() }} Ks → စုစုပေါင်း <span class="text-yellow-400">{{ totalAmount.toLocaleString() }} Ks</span></p>
            </div>
            <button @click="nextStep" :disabled="!method || amount <= 0" class="w-full mt-5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 rounded-xl disabled:opacity-40">ဆက်လုပ်ရန်</button>
          </div>

          <div v-else-if="step === 2">
            <button @click="step = 1" class="text-gray-400 hover:text-white mb-3 flex items-center gap-1 text-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg> နောက်သို့</button>
            <h2 class="text-lg font-bold text-white mb-4">ငွေလွှဲရန်</h2>
            <div class="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
              <p class="text-gray-400 text-xs mb-1">လက်ခံသူ</p>
              <p class="text-white font-semibold">Ma Khaing Zin Moe</p>
              <p class="text-gray-400 text-xs mt-3 mb-1">အကောင့်နံပါတ်</p>
              <p class="text-white font-mono text-lg tracking-wider">9446323509</p>
            </div>
            <label class="block text-gray-400 text-xs mb-2 ml-1">ပြေစာနောက် ၅ လုံး</label>
            <input v-model="slip" maxlength="5" type="text" inputmode="numeric" placeholder="XXXXX" class="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg tracking-[0.5em] focus:outline-none focus:border-yellow-500/50" />
            <button @click="submitDeposit" :disabled="slip.length < 5 || loading" class="w-full mt-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-40">
              <span v-if="!loading">အတည်ပြုမည်</span>
              <span v-else>တောင်းဆိုနေသည်...</span>
            </button>
            <p v-if="error" class="text-red-400 text-sm mt-2">{{ error }}</p>
          </div>

          <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
const step = ref(1)
const method = ref('wave')
const amount = ref(2000)
const slip = ref('')
const loading = ref(false)
const error = ref('')
const amountPresets = [2000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000]

const bonusPercent = 70
const bonusAmount = computed(() => Math.round(amount.value * bonusPercent / 100))
const totalAmount = computed(() => amount.value + bonusAmount.value)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) { step.value = 1; amount.value = 2000; slip.value = ''; error.value = '' }
})

const close = () => emit('update:modelValue', false)

const nextStep = () => {
  if (!method.value || amount.value <= 0) return
  step.value = 2
}

const submitDeposit = async () => {
  if (slip.value.length !== 5) return
  loading.value = true
  error.value = ''
  try {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (!token) throw new Error('Not logged in')
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/deposit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: method.value,
        amount: amount.value,
        slip: slip.value
      })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    close()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active { animation: slideUp 0.3s ease-out; }
.modal-leave-active { animation: slideUp 0.2s ease-in reverse; }
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
