<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 pb-20">
    <header class="sticky top-0 z-30 bg-[#0b141a]/80 backdrop-blur-lg border-b border-cyan-500/10 px-4 py-2">
      <h1 class="text-lg font-bold text-center text-cyan-300">Admin Dashboard</h1>
      <!-- Tab Bar -->
      <div class="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
        <button v-for="(tab, i) in tabs" :key="i" @click="activeTab = i"
          class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
          :class="activeTab === i ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-cyan-500/5 border-gray-700 text-gray-400 hover:bg-cyan-500/10'">
          {{ tab }}
        </button>
      </div>
    </header>

    <div class="px-4 pt-6 space-y-6 relative z-10">
      <!-- Login (if not logged in) -->
      <div v-if="!loggedIn" class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 text-center">
        <p class="text-gray-400 mb-4">Enter admin password</p>
        <input v-model="adminKey" type="password" placeholder="Admin Secret" class="w-full max-w-xs p-3 rounded-xl bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 mb-4" @keyup.enter="login" />
        <button @click="login" :disabled="!adminKey" class="bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95 transition-all">Login</button>
      </div>

      <!-- Tabs Content (when logged in) -->
      <div v-else>
        <!-- Tab 0: Transactions -->
        <div v-if="activeTab === 0">
          <!-- Filter Form -->
          <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 mb-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-400 mb-1 block">Status</label>
                <select v-model="filter.status" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-gray-400 mb-1 block">Type</label>
                <select v-model="filter.type" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                  <option value="">All</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                </select>
              </div>
            </div>
            <button @click="fetchTransactions" class="mt-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold px-6 py-2 rounded-full transition-all w-full">Search</button>
          </div>

          <!-- Transaction List -->
          <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5">
            <h3 class="font-bold text-white mb-4">Transactions</h3>
            <div v-if="loadingTx" class="text-center py-4 text-gray-500">Loading...</div>
            <div v-else-if="txError" class="text-center py-4 text-red-400">{{ txError }}</div>
            <div v-else>
              <div v-for="tx in transactions" :key="tx.id" class="bg-black/20 rounded-xl p-4 mb-3 border border-cyan-500/10">
                <p class="text-sm font-bold text-white">{{ tx.type.toUpperCase() }} - {{ tx.amount?.toLocaleString() }} Ks</p>
                <p class="text-xs text-gray-400">User: {{ tx.user_id?.slice(0,8) }}... | Method: {{ tx.method }} | Slip: {{ tx.slip_last5 || tx.phone }}</p>
                <p class="text-xs">Status: <span :class="tx.status === 'pending' ? 'text-yellow-400' : tx.status === 'confirmed' ? 'text-emerald-400' : 'text-red-400'">{{ tx.status }}</span></p>
                <div v-if="tx.status === 'pending'" class="flex gap-2 mt-2">
                  <button @click="approveReject(tx.id, 'approve')" class="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs px-4 py-1.5 rounded-full transition-all">Approve</button>
                  <button @click="approveReject(tx.id, 'reject')" class="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-4 py-1.5 rounded-full transition-all">Reject</button>
                </div>
              </div>
              <div v-if="transactions.length === 0" class="text-center py-6 text-gray-500">No transactions found</div>
            </div>
          </div>
        </div>

        <!-- Tab 1: Settings -->
        <div v-if="activeTab === 1">
          <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 space-y-4">
            <h3 class="font-bold text-white">System Settings</h3>

            <!-- WavePay Settings -->
            <div>
              <h4 class="text-sm text-cyan-300 mb-2">WavePay</h4>
              <label class="text-xs text-gray-400">Recipient Name</label>
              <input v-model="settings.wave_recipient_name" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 mb-2" />
              <label class="text-xs text-gray-400">Account Number</label>
              <input v-model="settings.wave_recipient_account" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            </div>

            <!-- KBZ Pay Settings -->
            <div>
              <h4 class="text-sm text-cyan-300 mb-2">KBZ Pay</h4>
              <label class="text-xs text-gray-400">Recipient Name</label>
              <input v-model="settings.kpay_recipient_name" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 mb-2" />
              <label class="text-xs text-gray-400">Account Number</label>
              <input v-model="settings.kpay_recipient_account" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            </div>

            <!-- Commission / Bonus -->
            <div>
              <h4 class="text-sm text-cyan-300 mb-2">Commission & Wagering</h4>
              <label class="text-xs text-gray-400">Direct Commission Rate (%)</label>
              <input v-model="settings.commission_direct_rate" type="number" step="0.1" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 mb-2" />
              <label class="text-xs text-gray-400">Override Commission Rate (%)</label>
              <input v-model="settings.commission_override_rate" type="number" step="0.1" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 mb-2" />
              <label class="text-xs text-gray-400">Wagering Multiplier</label>
              <input v-model="settings.wagering_multiplier" type="number" step="1" class="w-full p-2.5 rounded-lg bg-[#0b141a] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            </div>

            <button @click="saveSettings" :disabled="savingSettings" class="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold py-3 rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95 transition-all">
              {{ savingSettings ? 'Saving...' : 'Save Settings' }}
            </button>
            <p v-if="settingsMsg" :class="settingsOk ? 'text-emerald-400' : 'text-red-400'" class="text-xs text-center">{{ settingsMsg }}</p>
          </div>
        </div>

        <!-- Tab 2: Users (placeholder) -->
        <div v-if="activeTab === 2" class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 text-center text-gray-500 py-10">
          User management coming soon.
        </div>

        <!-- Tab 3: Games (placeholder) -->
        <div v-if="activeTab === 3" class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 text-center text-gray-500 py-10">
          Game management coming soon.
        </div>
      </div>
    </div>

    <!-- Bottom Nav (minimal, only admin) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0b141a]/95 backdrop-blur-xl border-t border-cyan-500/10 z-40 py-2">
      <div class="flex justify-center">
        <span class="text-xs text-gray-500">Admin Panel v1.0</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const adminKey = ref('')
const loggedIn = ref(false)

// Tabs
const activeTab = ref(0)
const tabs = ['Transactions', 'Settings', 'Users', 'Games']

// Transaction filters
const filter = reactive({ status: '', type: '' })
const transactions = ref([])
const loadingTx = ref(false)
const txError = ref('')

// Settings
const settings = reactive({
  wave_recipient_name: '',
  wave_recipient_account: '',
  kpay_recipient_name: '',
  kpay_recipient_account: '',
  commission_direct_rate: '10',
  commission_override_rate: '3',
  wagering_multiplier: '10'
})
const savingSettings = ref(false)
const settingsMsg = ref('')
const settingsOk = ref(false)

// Auto-login if stored
const savedKey = localStorage.getItem('admin_key')
if (savedKey) {
  adminKey.value = savedKey
  loggedIn.value = true
}

const login = () => {
  localStorage.setItem('admin_key', adminKey.value)
  loggedIn.value = true
  fetchTransactions()
  loadSettings()
}

const fetchTransactions = async () => {
  loadingTx.value = true
  txError.value = ''
  try {
    const body = {}
    if (filter.status) body.status = filter.status
    if (filter.type) body.type = filter.type

    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/admin_get_transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': localStorage.getItem('admin_key') || ''
      },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (data.error) {
      txError.value = data.error
    } else {
      transactions.value = data.data || []
    }
  } catch (e) {
    txError.value = 'Network error: ' + e.message
  } finally {
    loadingTx.value = false
  }
}

const approveReject = async (id, action) => {
  try {
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/admin_approve_reject_v4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': localStorage.getItem('admin_key') || ''
      },
      body: JSON.stringify({ transactionId: id, action })
    })
    const data = await res.json()
    if (data.error) alert(data.error)
    else fetchTransactions()
  } catch (e) { alert('Network error: ' + e.message) }
}

// Load current settings from system_settings table
const loadSettings = async () => {
  try {
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/admin_get_transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': localStorage.getItem('admin_key') || ''
      },
      body: JSON.stringify({ key: 'all_settings' }) // special flag
    })
    const data = await res.json()
    if (data && data.settings) {
      Object.assign(settings, data.settings)
    }
  } catch (e) { /* ignore */ }
}

const saveSettings = async () => {
  savingSettings.value = true
  settingsMsg.value = ''
  try {
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/admin_update_settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': localStorage.getItem('admin_key') || ''
      },
      body: JSON.stringify({ settings: { ...settings } })
    })
    const data = await res.json()
    if (data.error) {
      settingsOk.value = false
      settingsMsg.value = data.error
    } else {
      settingsOk.value = true
      settingsMsg.value = 'Settings saved successfully!'
    }
  } catch (e) {
    settingsOk.value = false
    settingsMsg.value = 'Network error'
  } finally {
    savingSettings.value = false
  }
}

if (loggedIn.value) {
  fetchTransactions()
  loadSettings()
}
</script>
