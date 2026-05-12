<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated background particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 6" :key="i" class="absolute rounded-full bg-yellow-500/10 blur-xl animate-pulse" 
        :style="{ width: (100 + i*30)+'px', height: (100 + i*30)+'px', left: (10 + i*15)+'%', top: (20 + i*10)+'%', animationDelay: (i*0.4)+'s' }" />
    </div>

    <div class="w-full max-w-sm relative z-10">
      <div class="bg-[#111]/80 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 shadow-2xl shadow-yellow-500/10">
        <h1 class="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          NovaBETT
        </h1>
        
        <div class="space-y-5">
          <!-- Username -->
          <div class="group">
            <label class="block text-gray-300 text-sm mb-1 ml-1 glitch" data-text="Username">Username</label>
            <div class="relative">
              <input v-model="username" class="w-full p-3 pl-10 rounded-xl bg-[#222] border border-gray-600 text-white uppercase focus:outline-none focus:border-yellow-500 transition-all duration-300" placeholder="USERNAME" @input="username = username.toUpperCase()" />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <p class="text-xs text-gray-500 mt-1 ml-1">e.g. johnsmith</p>
          </div>

          <!-- Password -->
          <div class="group">
            <label class="block text-gray-300 text-sm mb-1 ml-1 glitch" data-text="Password">Password</label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" class="w-full p-3 pl-10 pr-12 rounded-xl bg-[#222] border border-gray-600 text-white focus:outline-none focus:border-yellow-500 transition-all duration-300" placeholder="••••••" />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <button @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1 ml-1">e.g. MyStr0ngP@ss</p>
          </div>

          <!-- Submit Button -->
          <button @click="login" :disabled="loading" class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">Login</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Loading...
            </span>
          </button>

          <p class="text-red-400 text-sm text-center">{{ error }}</p>
          <p class="text-gray-400 text-center text-sm">No account? <router-link to="/register" class="text-yellow-500 font-medium hover:underline">Register</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Please fill all fields'
    return
  }
  loading.value = true
  try {
    const email = `${username.value.toUpperCase()}@novabett.internal`
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password: password.value })
    if (authError) throw authError
    localStorage.setItem('sb_token', data.session.access_token)
    localStorage.setItem('sb_refresh', data.session.refresh_token)
    localStorage.setItem('sb_username', username.value.toUpperCase())
    router.push('/home')
  } catch (e) {
    error.value = e.message || 'Login failed'
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
