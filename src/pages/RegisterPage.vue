<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 8" :key="i" class="absolute rounded-full bg-blue-500/10 blur-xl animate-pulse" 
        :style="{ width: (80 + i*20)+'px', height: (80 + i*20)+'px', left: (5 + i*12)+'%', top: (10 + i*8)+'%', animationDelay: (i*0.3)+'s' }" />
    </div>

    <div class="w-full max-w-sm relative z-10">
      <div class="bg-[#111]/80 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
        <h1 class="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          NovaBETT
        </h1>
        
        <div class="space-y-5">
          <!-- Username -->
          <div class="group">
            <label class="block text-gray-300 text-sm mb-1 ml-1 glitch" data-text="Username">Username</label>
            <input v-model="username" class="w-full p-3 rounded-xl bg-[#222] border border-gray-600 text-white uppercase focus:outline-none focus:border-blue-500 transition-all duration-300" placeholder="USERNAME" @input="username = username.toUpperCase()" />
            <p class="text-xs text-gray-500 mt-1 ml-1">e.g. johnsmith</p>
          </div>

          <!-- Password -->
          <div class="group">
            <label class="block text-gray-300 text-sm mb-1 ml-1 glitch" data-text="Password">Password</label>
            <input v-model="password" type="password" class="w-full p-3 rounded-xl bg-[#222] border border-gray-600 text-white focus:outline-none focus:border-blue-500 transition-all duration-300" placeholder="••••••" />
            <div class="mt-2 flex gap-1 px-1">
              <div v-for="n in 3" :key="n" class="h-1.5 flex-1 rounded-full transition-all duration-300" :class="strengthBarClass(n)"></div>
            </div>
            <p class="text-xs mt-1 ml-1 transition-colors duration-300" :class="strengthTextColor">{{ strengthLabel }}</p>
            <p class="text-xs text-gray-500 mt-1 ml-1">e.g. MyStr0ngP@ss</p>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-gray-300 text-sm mb-1 ml-1 glitch" data-text="Phone Number">Phone Number</label>
            <div class="flex items-center bg-[#222] rounded-xl border border-gray-600 focus-within:border-blue-500 transition-all duration-300">
              <span class="pl-3 pr-2 text-gray-300 border-r border-gray-600">+95</span>
              <input v-model="phone" class="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none" placeholder="989..." />
            </div>
            <p class="text-xs text-gray-500 mt-1 ml-1">e.g. 989123456 or 099123456</p>
          </div>

          <!-- Submit Button -->
          <button @click="register" :disabled="loading" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">Register</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Registering...
            </span>
          </button>

          <p class="text-red-400 text-sm text-center">{{ error }}</p>
          <p class="text-gray-400 text-center text-sm">Already have account? <router-link to="/login" class="text-blue-400 font-medium hover:underline">Login</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter, useRoute } from 'vue-router'

const username = ref('')
const phone = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const route = useRoute()
const referralUsername = route.query.dl || ''

// Password strength logic
const strengthLevel = computed(() => {
  const p = password.value
  if (p.length === 0) return 0
  let score = 0
  if (p.length >= 6) score++
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  if (score <= 1) return 1
  if (score <= 3) return 2
  return 3
})

const strengthLabel = computed(() => {
  switch (strengthLevel.value) {
    case 1: return 'Weak'
    case 2: return 'Medium'
    case 3: return 'Strong'
    default: return ''
  }
})

const strengthTextColor = computed(() => {
  switch (strengthLevel.value) {
    case 1: return 'text-red-400'
    case 2: return 'text-orange-400'
    case 3: return 'text-green-400'
    default: return 'text-gray-400'
  }
})

function strengthBarClass(index) {
  if (strengthLevel.value >= index) {
    if (strengthLevel.value === 1) return 'bg-red-500'
    if (strengthLevel.value === 2) return 'bg-orange-500'
    return 'bg-green-500'
  }
  return 'bg-gray-600'
}

async function register() {
  error.value = ''
  if (!username.value || !phone.value || !password.value) {
    error.value = 'Please fill all fields'
    return
  }
  loading.value = true
  try {
    const response = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/register3', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb',
        'apikey': 'sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        phone: phone.value,
        password: password.value,
        referral: referralUsername
      })
    })

    const data = await response.json()

    if (data.success) {
      // Auto login
      const email = `${username.value.toUpperCase()}@novabett.internal`
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password: password.value })
      if (loginError) {
        error.value = 'Login error: ' + loginError.message
        return
      }
      localStorage.setItem('sb_token', loginData.session.access_token)
      localStorage.setItem('sb_refresh', loginData.session.refresh_token)
            localStorage.setItem('sb_username', username.value.toUpperCase())
      router.push('/home')
    } else {
      error.value = data.error || 'Unknown error'
    }
  } catch (e) {
    error.value = 'Exception: ' + e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.glitch {
  position: relative;
  display: inline-block;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
.glitch::before {
  color: #0ff;
  z-index: -1;
  animation: glitch-effect 2s infinite linear alternate-reverse;
}
.glitch::after {
  color: #f0f;
  z-index: -2;
  animation: glitch-effect 2s infinite linear alternate;
}
@keyframes glitch-effect {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
  100% { transform: translate(0); }
}
</style>
