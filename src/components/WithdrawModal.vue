<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" @click.self="close">
        <div class="bg-[#141428] border border-white/10 rounded-t-2xl w-full sm:max-w-md p-5 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
          
          <h2 class="text-lg font-bold text-white mb-4">ငွေထုတ်ရန်</h2>

          <label class="block text-gray-400 text-xs mb-2 ml-1">နည်းလမ်းရွေးပါ</label>
          <div class="flex gap-2 mb-5">
            <button @click="method = 'wave'" :class="method === 'wave' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 py-3 rounded-xl border font-semibold text-sm">🌊 WavePay</button>
            <button @click="method = 'kpay'" :class="method === 'kpay' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'" class="flex-1 py-3 rounded-xl border font-semibold text-sm">💳 KBZ Pay</button>
          </div>

          <label class="block text-gray-400 text-xs mb-2 ml-1">ငွေလက်ခံမည့် ဖုန်းနံပါတ်</label>
          <input v-model="phone" type="tel" placeholder="09xxxxxxxxx" class="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50 mb-4" />

          <label class="block text-gray-400 text-xs mb-2 ml-1">ငွေလက်ခံသူအမည်</label>
          <input v-model="accountName" type="text" placeholder="အမည်အပြည့်အစုံ" class="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-500/50 mb-4" />

          <label class="block text-gray-400 text-xs mb-2 ml-1">ထုတ်ယူမည့်ပမာဏ</label>
          <div class="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-yellow-500/50 mb-2">
            <input v-model.number="amount" type="number" placeholder="0" class="flex-1 p-3 bg-transparent text-white text-sm focus:outline-none" />
            <span class="pr-3 text-gray-400 text-sm">Ks</span>
          </div>

          <div class="flex justify-between items-center mb-4 px-1">
            <span class="text-gray-500 text-xs">လက်ကျန်ငွေ</span>
            <span class="text-white text-sm font-semibold">{{ currentBalance.toLocaleString() }} Ks</span>
          </div>

          <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5">
            <p class="text-red-300 text-xs">⚠️ အကောင့်အချက်အလက် သေချာစစ်ဆေးပါ။ မှားယွင်းပါက ငွေရောက်မည်မဟုတ်ပါ။</p>
          </div>

          <button @click="submitWithdraw" :disabled="!isValid || loading" class="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-500/30 disabled:opacity-40">
            <span v-if="!loading">ငွေထုတ်မည်</span>
            <span v-else>တောင်းဆိုနေသည်...</span>
          </button>
          <p v-if="error" class="text-red-400 text-sm mt-2">{{ error }}</p>

          <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps({
  modelValue: Boolean,
  balance: { type: Number, default: 0 }
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
const method = ref('wave')
const phone = ref('')
const accountName = ref('')
const amount = ref(0)
const loading = ref(false)
const error = ref('')

const currentBalance = computed(() => props.balance)

const isValid = computed(() => method.value && phone.value.length >= 9 && accountName.value.trim() && amount.value > 0 && amount.value <= currentBalance.value)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) { phone.value = ''; accountName.value = ''; amount.value = 0; error.value = '' }
})

const close = () => emit('update:modelValue', false)

const submitWithdraw = async () => {
  if (!isValid.value) return
  loading.value = true
  error.value = ''
  try {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (!token) throw new Error('Not logged in')
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/withdraw', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: method.value,
        phone: phone.value,
        accountName: accountName.value,
        amount: amount.value
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
