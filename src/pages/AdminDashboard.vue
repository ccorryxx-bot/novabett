<template>
  <div class="min-h-screen bg-[#0a0a14] text-white p-4">
    <h1 class="text-2xl font-bold text-yellow-400 mb-6">Admin Dashboard</h1>
    <div v-if="!loggedIn">
      <input v-model="adminKey" type="password" placeholder="Admin Secret" class="p-2 rounded bg-gray-800 border border-gray-600 mb-4" @keyup.enter="login" />
      <button @click="login" class="bg-yellow-500 text-black px-4 py-2 rounded" :disabled="!adminKey">Login</button>
    </div>
    
    <div v-else class="mt-6">
      <h2 class="text-xl mb-4">Pending Transactions</h2>
      <button @click="fetchTransactions" class="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm mb-4">Refresh</button>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="text-red-400">{{ error }}</div>
      <div v-else>
        <div v-for="tx in transactions" :key="tx.id" class="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
          <p><strong>{{ tx.type.toUpperCase() }} - {{ tx.amount?.toLocaleString() }} Ks</strong></p>
          <p>User: {{ tx.user_id?.slice(0,8) }}... | Method: {{ tx.method }} | Slip: {{ tx.slip_last5 || tx.phone }}</p>
          <p>Status: <span :class="tx.status === 'pending' ? 'text-yellow-400' : tx.status === 'confirmed' ? 'text-green-400' : 'text-red-400'">{{ tx.status }}</span></p>
          <div v-if="tx.status === 'pending'" class="flex gap-2 mt-2">
            <button @click="approveReject(tx.id, 'approve')" class="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm">Approve</button>
            <button @click="approveReject(tx.id, 'reject')" class="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm">Reject</button>
          </div>
          <div v-if="tx.status === 'confirmed'" class="text-xs text-green-400 mt-1">✔ Approved</div>
          <div v-if="tx.status === 'rejected'" class="text-xs text-red-400 mt-1">✖ Rejected</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const adminKey = ref('')
const loggedIn = ref(false)
const transactions = ref([])
const loading = ref(false)
const error = ref('')

const login = async () => {
  localStorage.setItem('admin_key', adminKey.value)
  loggedIn.value = true
  fetchTransactions()
}

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''
  try {
    // Change this URL if your function URL is different
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/admin_get_transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': localStorage.getItem('admin_key') || ''
      },
      body: JSON.stringify({ status: 'pending' })
    })
    const data = await res.json()
    if (data.error) {
      error.value = data.error
    } else {
      transactions.value = data.data || []
    }
  } catch (e) {
    error.value = 'Network error: ' + e.message
  } finally {
    loading.value = false
  }
}

const approveReject = async (id, action) => {
  try {
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/admin_approve_reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': localStorage.getItem('admin_key') || ''
      },
      body: JSON.stringify({ transactionId: id, action })
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    } else {
      fetchTransactions() // refresh
    }
  } catch (e) {
    alert('Network error: ' + e.message)
  }
}
</script>
