<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="close">
        <div class="bg-[#141428] border border-cyan-500/20 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
          
          <!-- Step 1: Payment Method + Amount -->
          <div v-if="step === 1">
            <h2 class="text-lg font-bold text-white mb-4">ငွေသွင်းရန်</h2>
            
            <!-- Payment Methods with Logos -->
            <label class="block text-gray-400 text-xs mb-2 ml-1">နည်းလမ်းရွေးပါ</label>
            <div class="flex gap-2 mb-5">
              <button @click="method = 'wave'" :class="method === 'wave' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 flex flex-col items-center gap-2 justify-center py-4 rounded-xl border transition-all font-semibold text-sm">
                <img src="/images/payments/wave.png" alt="WavePay" class="w-10 h-10 object-contain" />
                <span class="text-xs">WavePay</span>
              </button>
              <button @click="method = 'kpay'" :class="method === 'kpay' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 flex flex-col items-center gap-2 justify-center py-4 rounded-xl border transition-all font-semibold text-sm">
                <img src="/images/payments/kpay.png" alt="KBZ Pay" class="w-10 h-10 object-contain" />
                <span class="text-xs">KBZ Pay</span>
              </button>
            </div>

            <!-- Amount -->
            <label class="block text-gray-400 text-xs mb-2 ml-1">ငွေပမာဏ</label>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <button v-for="amt in amountPresets" :key="amt" @click="amount = amt" :class="amount === amt ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20' : 'bg-white/5 border border-white/10 text-gray-300'" class="py-2.5 rounded-xl text-sm transition-all active:scale-95">
                {{ amt.toLocaleString() }}
              </button>
            </div>
            <input v-model.number="amount" type="number" placeholder="စိတ်ကြိုက်ပမာဏ" class="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-all" />

            <!-- Bonus Preview -->
            <div v-if="amount && amount > 0" class="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <p class="text-yellow-300 text-xs font-medium">🎁 {{ bonusPercent }}% ဘောနပ်</p>
              <p class="text-white text-sm font-semibold mt-1">
                +{{ bonusAmount.toLocaleString() }} Ks → စုစုပေါင်း <span class="text-yellow-400">{{ totalAmount.toLocaleString() }} Ks</span>
              </p>
            </div>

            <button @click="nextStep" :disabled="!method || !amount || amount <= 0" class="w-full mt-5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/30 transition-all hover:shadow-yellow-500/50 disabled:opacity-40 disabled:cursor-not-allowed">
              ဆက်လုပ်ရန်
            </button>
          </div>

          <!-- Step 2: Recipient Info + Slip -->
          <div v-else-if="step === 2">
            <button @click="step = 1" class="text-gray-400 hover:text-white mb-3 flex items-center gap-1 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg> နောက်သို့
            </button>
            <h2 class="text-lg font-bold text-white mb-4">ငွေလွှဲရန်</h2>
            
            <!-- Recipient Info with Copy Buttons -->
            <div class="bg-white/5 rounded-xl p-4 mb-4 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-xs mb-1">လက်ခံသူ</p>
                  <p class="text-white font-semibold">{{ recipientName }}</p>
                </div>
                <button @click="copyText(recipientName)" class="text-gray-400 hover:text-white transition-colors p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </button>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-xs mb-1">အကောင့်နံပါတ်</p>
                  <p class="text-white font-mono text-lg tracking-wider">{{ recipientAccount }}</p>
                </div>
                <button @click="copyText(recipientAccount)" class="text-gray-400 hover:text-white transition-colors p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </button>
              </div>
            </div>

            <p v-if="copied" class="text-emerald-400 text-xs text-center mb-2">ကူးယူပြီးပါပြီ ✅</p>

            <label class="block text-gray-400 text-xs mb-2 ml-1">ပြေစာနောက် ၅ လုံး</label>
            <input v-model="slip" maxlength="5" type="text" inputmode="numeric" placeholder="XXXXX" class="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg tracking-[0.5em] focus:outline-none focus:border-yellow-500/50 transition-all" />

            <button @click="submitDeposit" :disabled="slip.length < 5" class="w-full mt-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed">
              အတည်ပြုမည်
            </button>
          </div>

          <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
const step = ref(1)
const method = ref('wave')
const amount = ref(2000)
const slip = ref('')
const copied = ref(false)

const amountPresets = [2000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000]

// Recipient details (will be loaded from system_settings)
const recipientName = ref('')
const recipientAccount = ref('')

// Fetch payment settings from Supabase
async function fetchPaymentSettings() {
  const { data, error } = await supabase
    .from('system_settings')
    .select('key, value')
    .in('key', ['wave_recipient_name', 'wave_recipient_account', 'kpay_recipient_name', 'kpay_recipient_account'])
  
  if (data && !error) {
    const settings = {}
    data.forEach(row => { settings[row.key] = row.value })
    // Update based on currently selected method
    if (method.value === 'wave') {
      recipientName.value = settings.wave_recipient_name || 'Ma Khaing Zin Moe'
      recipientAccount.value = settings.wave_recipient_account || '9446323509'
    } else {
      recipientName.value = settings.kpay_recipient_name || 'Ma Khaing Zin Moe'
      recipientAccount.value = settings.kpay_recipient_account || '9446323509'
    }
  } else {
    // Fallback defaults
    recipientName.value = 'Ma Khaing Zin Moe'
    recipientAccount.value = '9446323509'
  }
}

// Re-fetch when method changes (to update displayed details)
watch(method, () => {
  fetchPaymentSettings()
})

// Fetch when modal opens
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    step.value = 1
    amount.value = 2000
    slip.value = ''
    fetchPaymentSettings() // load latest settings
  }
})

const bonusPercent = 70
const bonusAmount = computed(() => Math.round(amount.value * bonusPercent / 100))
const totalAmount = computed(() => amount.value + bonusAmount.value)

const close = () => {
  emit('update:modelValue', false)
}

const nextStep = () => {
  if (!method.value || amount.value <= 0) return
  step.value = 2
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch (e) {
    prompt('Copy manually:', text)
  }
}

const submitDeposit = () => {
  if (slip.value.length !== 5) return
  emit('submit', {
    method: method.value,
    amount: amount.value,
    slip: slip.value
  })
  close()
}
</script>

<style scoped>
.modal-enter-active { animation: slideUp 0.3s ease-out; }
.modal-leave-active { animation: slideUp 0.2s ease-in reverse; }
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
