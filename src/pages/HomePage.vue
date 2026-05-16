	<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 flex flex-col selection:bg-cyan-500/30">
    <!-- Toast Container -->
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[100] space-y-2 w-72 pointer-events-none">
        <TransitionGroup name="toast">
          <div v-for="toast in toasts" :key="toast.id"
            class="pointer-events-auto p-3 rounded-lg border shadow-lg backdrop-blur-md flex items-center gap-2 text-sm font-semibold"
            :class="{
              'bg-teal-500/10 border-teal-500/30 text-teal-300': toast.type === 'success',
              'bg-red-500/10 border-red-500/30 text-red-400': toast.type === 'error',
              'bg-yellow-500/10 border-yellow-500/30 text-yellow-400': toast.type === 'warning'
            }">
            <span v-if="toast.type === 'success'">✓</span>
            <span v-else-if="toast.type === 'error'">✕</span>
            <span v-else>⚠</span>
            <span>{{ toast.message }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <div class="flex-1">
      <div class="px-4 pt-6 pb-2 space-y-4 relative z-10">
        <!-- Welcome Text -->
        <p class="text-center text-cyan-500/80 text-[11px] font-semibold uppercase tracking-[0.3em] animate-fade-in">
          Welcome to <span class="text-cyan-400">NovaBETT</span>
        </p>

        <!-- Brand Name -->
        <div class="text-center">
          <h1 class="text-4xl font-black tracking-tighter relative inline-block">
            <span class="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(0,188,212,0.5)]">
              NovaBETT
            </span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          </h1>
          <p class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Premium Online Casino</p>
        </div>

        <!-- Top row: Search + Login/User info -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button @click="toggleSearch" class="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-cyan-500/10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <template v-if="!isLoggedIn">
              <button @click="showAuthModal = true; authTab = 'login'"
                class="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                <span class="relative z-10">Login</span>
              </button>
            </template>
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggleLanguage" class="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-gray-400 px-3 py-1 rounded-full transition-all">
              {{ currentLang === 'en' ? 'မြန်မာ' : 'English' }}
            </button>
          </div>
        </div>

        <!-- User Info Row (if logged in) -->
        <div v-if="isLoggedIn" class="flex items-center justify-between bg-[#111d26] border border-cyan-500/10 rounded-2xl px-4 py-3 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-sm font-black text-white shadow-lg">
              {{ username.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-bold text-white">{{ username }}</p>
              <p class="text-xs text-gray-400">
                <span v-if="balanceLoading" class="animate-pulse">...</span>
                <span v-else class="text-cyan-400 font-semibold">{{ formatCurrency(mainBalance) }} Ks</span>
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="showDepositModal = true" class="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-xs py-2 px-4">Deposit</button>
            <button @click="showWithdrawModal = true" class="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold rounded-full border border-cyan-500/30 active:scale-95 transition-all text-xs py-2 px-4">Withdraw</button>
          </div>
        </div>

        <!-- Search bar -->
        <div v-if="searchVisible" class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search games..." class="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111d26] border border-cyan-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm" />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <!-- Carousel with FIXED image display -->
      <div class="px-4 pt-4">
        <div class="rounded-2xl overflow-hidden relative h-40 bg-[#111d26] border border-cyan-500/10 shadow-sm">
          <div class="absolute inset-0 flex transition-transform duration-500" :style="{ transform: `translateX(-${carouselIndex * 100}%)` }">
            <div v-for="(img, i) in carouselImages" :key="i" class="w-full h-full flex-shrink-0 relative">
              <img :src="img.image" class="w-full h-full object-cover" alt="" />
              <div class="absolute inset-0 bg-black/40"></div>
            </div>
          </div>
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            <button v-for="(img, i) in carouselImages" :key="i" @click="carouselIndex = i" class="w-2 h-2 rounded-full transition-all" :class="i === carouselIndex ? 'bg-cyan-400 w-4' : 'bg-gray-600'"></button>
          </div>
        </div>
      </div>

      <!-- Game Categories -->
      <div class="px-4 pt-6 pb-3">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Game Categories</h2>
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button v-for="cat in categories" :key="cat.name" @click="activeCategory = cat.name"
            class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border"
            :class="activeCategory === cat.name ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm' : 'bg-cyan-500/5 border-gray-700 text-gray-400 hover:bg-cyan-500/10'">
            <img v-if="cat.logo" :src="cat.logo" class="w-4 h-4 object-contain rounded-full" alt="" />
            <span v-else class="text-[10px] font-bold tracking-tight">{{ cat.name.toUpperCase() }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Game Cards Grid -->
      <div class="px-4">
        <div class="grid grid-cols-3 gap-3">
          <!-- Skeleton Loader -->
          <template v-if="loadingGames">
            <div v-for="n in 9" :key="n" class="rounded-2xl bg-[#111d26] border border-cyan-500/10 overflow-hidden animate-pulse">
              <div class="aspect-square bg-cyan-500/5"></div>
              <div class="p-2 h-5 bg-cyan-500/5 rounded mt-1"></div>
            </div>
          </template>
          <!-- Actual Cards -->
          <div v-else v-for="game in filteredGames" :key="game.id" @click="openGame(game)"
            class="group bg-[#111d26] border border-cyan-500/10 rounded-2xl overflow-hidden active:scale-95 transition-all duration-200 cursor-pointer hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10">
            <div class="relative w-full aspect-square bg-black/20 flex items-center justify-center overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5"></div>
              <span class="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-[9px] font-bold text-cyan-300">{{ game.provider }}</span>
<img :src="game.image_url" class="absolute inset-0 w-full h-full object-cover" alt="" />            </div>
            <div class="p-2"><h3 class="text-[11px] font-semibold leading-tight truncate text-gray-300">{{ game.name }}</h3></div>
          </div>
        </div>
        <!-- Error State -->
        <div v-if="!loadingGames && fetchError" class="text-center py-8">
          <p class="text-red-400 text-sm">{{ fetchError }}</p>
          <button @click="fetchGames" class="mt-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold px-4 py-2 rounded-full">Retry</button>
        </div>
        <!-- Empty State -->
        <div v-if="!loadingGames && !fetchError && filteredGames.length === 0" class="text-center py-8 text-gray-500">
          <p>No games found.</p>
        </div>
      </div>

      <!-- Extra space & more games -->
      <div class="h-6"></div>
      <div class="px-4 text-center text-xs text-gray-600">
        <p class="py-4">More games coming soon...</p>
      </div>
      <div class="h-8 border-t border-cyan-500/10 mx-4"></div>

      <!-- Footer -->
      <div class="px-4 pb-40 space-y-3 mt-4">
        <button @click="showFooterModal('team')" class="w-full bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 rounded-xl p-4 text-left text-sm font-semibold text-gray-300 hover:text-cyan-300 transition-all">
          NovaBETT Team
        </button>
        <button @click="showFooterModal('terms')" class="w-full bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 rounded-xl p-4 text-left text-sm font-semibold text-gray-300 hover:text-cyan-300 transition-all">
          Terms of Service
        </button>
        <button @click="showFooterModal('plus18')" class="w-full bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 rounded-xl p-4 text-left text-sm font-semibold text-gray-300 hover:text-cyan-300 transition-all">
          18+
        </button>
        <p class="text-center text-[10px] text-gray-600 pt-4">&copy; 2026 NovaBETT. All rights reserved.</p>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0b141a]/95 backdrop-blur-xl border-t border-cyan-500/10 z-50 pointer-events-auto safe-area-bottom">
      <div class="flex justify-around items-center py-2 px-1">
        <router-link to="/home" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200" :class="$route.path === '/home' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span class="text-[10px] font-semibold">Home</span>
        </router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200" :class="$route.path === '/promotions' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12v8H4v-8l8-8 8 8zm-2 2H6v4h12v-4zM12 2l-8 8h16l-8-8z"/></svg>
          <span class="text-[10px] font-semibold">Promos</span>
        </router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200" :class="$route.path === '/agent' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span class="text-[10px] font-semibold">Agents</span>
        </router-link>
        <router-link to="/service" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200" :class="$route.path === '/service' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span class="text-[10px] font-semibold">Chat</span>
        </router-link>
        <router-link to="/account" class="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200" :class="$route.path === '/account' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span class="text-[10px] font-semibold">You</span>
        </router-link>
      </div>
    </nav>

<!-- ===== AUTH MODAL (Premium SVG + Eye Toggle + Age) ===== -->
<Teleport to="body">
  <Transition name="modal">
    <div v-if="showAuthModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md" @click.self="showAuthModal = false">
      <div class="bg-[#0a1219] border border-cyan-500/30 rounded-3xl w-full max-w-xs p-5 shadow-2xl shadow-cyan-500/10 animate-slide-up">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">NovaBETT</h2>
          <p class="text-[10px] text-gray-500 mt-1">Premium Online Casino</p>
        </div>

        <!-- Tabs -->
        <div class="flex mb-6">
          <button @click="authTab = 'login'"
            class="flex-1 py-2 rounded-l-full text-xs font-bold transition-all duration-300"
            :class="authTab === 'login' ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg' : 'bg-cyan-500/5 text-gray-400'">
            Login
          </button>
          <button @click="authTab = 'register'"
            class="flex-1 py-2 rounded-r-full text-xs font-bold transition-all duration-300"
            :class="authTab === 'register' ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg' : 'bg-cyan-500/5 text-gray-400'">
            Register
          </button>
        </div>

        <!-- Login Form -->
        <div v-if="authTab === 'login'" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-gray-300 text-xs font-semibold mb-1.5 ml-1">Username</label>
            <div class="relative">
              <!-- User Icon SVG -->
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <input v-model="loginUsername" type="text" placeholder="ကျေးဇူးပြု၍ဝင်ပါ အကောက်!"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111d26] border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                :class="loginUsernameValid ? 'border-cyan-500' : 'border-gray-700'"
                @input="loginUsername = loginUsername.toUpperCase()" />
            </div>
          </div>
          <!-- Password -->
          <div>
            <label class="block text-gray-300 text-xs font-semibold mb-1.5 ml-1">Password</label>
            <div class="relative">
              <!-- Lock Icon SVG -->
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <input v-model="loginPassword" :type="loginShowPassword ? 'text' : 'password'" placeholder="စကားဝှက်ထည့်ပါ!"
                class="w-full pl-10 pr-12 py-2.5 rounded-lg bg-[#111d26] border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                :class="loginPasswordValid ? 'border-cyan-500' : 'border-gray-700'" />
              <!-- Eye Toggle SVG -->
              <button @click="loginShowPassword = !loginShowPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                <svg v-if="!loginShowPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>
          <button @click="doLogin" :disabled="loginLoading || !loginUsernameValid || !loginPasswordValid"
            class="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loginLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Signing In...
            </span>
            <span v-else>Sign In</span>
          </button>
          <p class="text-red-400 text-sm text-center">{{ loginError }}</p>
        </div>

        <!-- Register Form -->
        <div v-else class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-gray-300 text-xs font-semibold mb-1.5 ml-1">Username</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <input v-model="regUsername" type="text" placeholder="ကျေးဇူးပြု၍ဝင်ပါ အကောက်!"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111d26] border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                :class="regUsernameValid ? 'border-cyan-500' : 'border-gray-700'"
                @input="regUsername = regUsername.toUpperCase()" />
            </div>
            <p class="text-[10px] text-gray-500 mt-1 ml-1">e.g. MOEMOE</p>
          </div>
          <!-- Password -->
          <div>
            <label class="block text-gray-300 text-xs font-semibold mb-1.5 ml-1">Password</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <input v-model="regPassword" :type="regShowPassword ? 'text' : 'password'" placeholder="စကားဝှက်ထည့်ပါ!"
                class="w-full pl-10 pr-12 py-2.5 rounded-lg bg-[#111d26] border text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                :class="regPasswordValid ? 'border-cyan-500' : 'border-gray-700'" />
              <button @click="regShowPassword = !regShowPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                <svg v-if="!regShowPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
            <!-- Strength Meter -->
            <div class="mt-2 flex gap-1 px-1">
              <div v-for="n in 3" :key="n" class="h-1.5 flex-1 rounded-full transition-all duration-300" :class="strengthBarClass(n)"></div>
            </div>
            <p class="text-[10px] ml-1 transition-colors duration-300" :class="strengthTextColor">{{ strengthLabel }}</p>
            <p class="text-[10px] text-gray-500 mt-1 ml-1">e.g. moe#223</p>
          </div>
          <!-- Phone Number -->
          <div>
            <label class="block text-gray-300 text-xs font-semibold mb-1.5 ml-1">Phone Number</label>
            <div class="flex items-center bg-[#111d26] rounded-lg border border-gray-700 focus-within:border-cyan-500 transition-colors">
              <span class="pl-3 pr-2 text-white text-sm">🇲🇲 +95</span>
              <input v-model="regPhone" type="tel" placeholder="ကျေးဇူးပြု၍ဖုန်းနံပါတ်ထည့်ပါ!"
                class="flex-1 p-2.5 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                :class="regPhoneValid ? 'border-cyan-500' : 'border-gray-700'" />
            </div>
            <p class="text-[10px] text-gray-500 mt-1 ml-1">e.g. 09123456789</p>
          </div>
          <!-- Age Confirmation (Auto-checked, read-only) -->
          <div class="flex items-start gap-2 mt-1">
            <div class="w-5 h-5 mt-0.5 flex-shrink-0 relative">
              <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"/></svg>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed">ကျွန်ုပ်သည် အသက် ၁၈ နှစ်ကျော်ပြီးဖြစ်ပါသည်။</p>
          </div>
          <button @click="doRegister" :disabled="regLoading || !regUsernameValid || !regPasswordValid || !regPhoneValid"
            class="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="regLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Creating...
            </span>
            <span v-else>Join NovaBETT</span>
          </button>
          <p class="text-red-400 text-sm text-center">{{ regError }}</p>
        </div>

        <button @click="showAuthModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  </Transition>
</Teleport>

    <!-- Footer Modals -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="footerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" @click.self="footerModal = null">
          <div class="bg-[#0a1219] border border-cyan-500/20 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
            <h2 class="text-xl font-bold text-white text-center mb-4">{{ footerModalTitle }}</h2>
            <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{{ footerModalContent }}</p>
            <button @click="footerModal = null" class="mt-6 w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold py-3 rounded-2xl shadow transition-all">Close</button>
            <button @click="footerModal = null" class="absolute top-4 right-4 text-gray-400 hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <DepositModal v-model="showDepositModal" @submit="handleDepositSubmit" />
    <WithdrawModal v-model="showWithdrawModal" :balance="mainBalance" @submit="handleWithdrawSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import DepositModal from '@/components/DepositModal.vue'
import WithdrawModal from '@/components/WithdrawModal.vue'

async function fetchGames() {
  loadingGames.value = true
  fetchError.value = null
  console.log('Fetching games from Supabase...')
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('provider', { ascending: true })
    if (error) throw error
    games.value = data || []
    console.log('Games loaded:', games.value.length)
    addToast(`Loaded ${games.value.length} games`, 'success')
  } catch (e) {
    console.error('Game fetch error:', e)
    fetchError.value = 'Failed to load games.'
    addToast('Failed to load games', 'error')
  } finally {
    loadingGames.value = false
  }
}
const route = useRoute()
const { locale } = useI18n()
const currentLang = ref(locale.value)
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'mm' : 'en'
  currentLang.value = locale.value
  localStorage.setItem('lang', locale.value)
}

const isLoggedIn = ref(false)
const username = ref('')
const mainBalance = ref(0)
const balanceLoading = ref(false)
const showAuthModal = ref(false)
const authTab = ref('login')
// Password visibility toggles
const loginShowPassword = ref(false)
const regShowPassword = ref(false)
const toasts = ref([])
let toastId = 0
const addToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}

onMounted(async () => {
  showAuthModal.value = false
  if (route.query.auth === 'login') {
    showAuthModal.value = true
    authTab.value = 'login'
    window.history.replaceState({}, document.title, window.location.pathname)
  }
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    await loadUserInfo()
    if (!username.value) { const saved = localStorage.getItem('sb_username'); if (saved) username.value = saved }
  }
  const savedLang = localStorage.getItem('lang')
  if (savedLang) { locale.value = savedLang; currentLang.value = savedLang }
  fetchGames()
})

async function loadUserInfo() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  isLoggedIn.value = true
  username.value = user.user_metadata?.username || user.email?.split('@')[0] || 'PLAYER'
  localStorage.setItem('sb_username', username.value)
  await fetchBalance()
}

async function fetchBalance() {
  balanceLoading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: wallet } = await supabase.from('wallets').select('main_balance').eq('user_id', user.id).single()
    mainBalance.value = wallet?.main_balance || 0
  } catch (e) { console.error(e) } finally { balanceLoading.value = false }
}

const loginUsernameValid = computed(() => loginUsername.value.trim().length > 0)
const loginPasswordValid = computed(() => loginPassword.value.length > 0)
const regUsernameValid = computed(() => regUsername.value.trim().length > 0)
const regPasswordValid = computed(() => regPassword.value.length >= 3)
const regPhoneValid = computed(() => regPhone.value.trim().length >= 6)

const loginUsername = ref('')
const loginPassword = ref('')
const loginLoading = ref(false)
const loginError = ref('')
async function doLogin() {
  loginError.value = ''
  if (!loginUsernameValid.value || !loginPasswordValid.value) return
  loginLoading.value = true
  try {
    const email = `${loginUsername.value.toUpperCase()}@novabett.internal`
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: loginPassword.value })
    if (error) throw error
    if (data.session?.access_token) localStorage.setItem('sb_token', data.session.access_token)
    await loadUserInfo()
    addToast('Successfully logged in', 'success')
    showAuthModal.value = false
    loginUsername.value = ''; loginPassword.value = ''
  } catch (e) { loginError.value = e.message; addToast(e.message, 'error') } finally { loginLoading.value = false }
}

const regUsername = ref('')
const regPhone = ref('')
const regPassword = ref('')
// Password strength logic
const strengthLevel = computed(() => {
  const p = regPassword.value
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
const regLoading = ref(false)
const regError = ref('')
async function doRegister() {
  regError.value = ''
  if (!regUsernameValid.value || !regPasswordValid.value || !regPhoneValid.value) return
  regLoading.value = true
  try {
    const referral = route.query.dl || ''
    const res = await fetch('https://vuywhhmwrqykukcemifd.supabase.co/functions/v1/register3', {
      method: 'POST',
      headers: { 'Authorization': `Bearer sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb`, 'apikey': 'sb_publishable_nQArOtFqTbi9ZtJCJC0STA_pE4ztXGb', 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: regUsername.value, phone: regPhone.value, password: regPassword.value, referral })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    const email = `${regUsername.value.toUpperCase()}@novabett.internal`
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password: regPassword.value })
    if (loginError) throw loginError
    if (loginData.session?.access_token) localStorage.setItem('sb_token', loginData.session.access_token)
    await loadUserInfo()
    addToast('Account created successfully!', 'success')
    showAuthModal.value = false
    regUsername.value = ''; regPhone.value = ''; regPassword.value = ''
  } catch (e) { regError.value = e.message; addToast(e.message, 'error') } finally { regLoading.value = false }
}

const games = ref([])
const loadingGames = ref(true)
const fetchError = ref(null)

const jackpot = ref(893619157998)
const displayedJackpot = ref('893,619,157,998')
const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num)
onMounted(() => {
  setInterval(() => {
    const inc = Math.floor(Math.random() * 500000 + 100000)
    jackpot.value += inc
    animateValue(jackpot.value - inc, jackpot.value)
  }, 5000)
})
function animateValue(start, end) {
  let current = start
  const range = end - start, dur = 800, stepTime = 20, steps = dur / stepTime, inc = range / steps
  let step = 0
  const timer = setInterval(() => { current += inc; if (step >= steps) { current = end; clearInterval(timer) }; displayedJackpot.value = formatNumber(Math.floor(current)); step++ }, stepTime)
}
const formatCurrency = (num) => new Intl.NumberFormat('en-US').format(num)

const carouselImages = [
  { image: '/images/banners/banner1.jpg', title: 'SLOT GAMES' },
  { image: '/images/banners/banner2.jpg', title: 'FISHING' },
  { image: '/images/banners/banner3.jpg', title: 'LIVE CASINO' },
  { image: '/images/banners/banner4.jpg', title: 'SPORTS' },
  { image: '/images/banners/banner5.jpg', title: 'ARCADE' }
]
const carouselIndex = ref(0)
let carouselTimer
onMounted(() => { carouselTimer = setInterval(() => nextSlide(), 4000) })
const prevSlide = () => { carouselIndex.value = carouselIndex.value === 0 ? carouselImages.length - 1 : carouselIndex.value - 1; resetTimer() }
const nextSlide = () => { carouselIndex.value = (carouselIndex.value + 1) % carouselImages.length; resetTimer() }
const resetTimer = () => { clearInterval(carouselTimer); carouselTimer = setInterval(() => nextSlide(), 4000) }

const searchVisible = ref(false)
const searchQuery = ref('')
const toggleSearch = () => { searchVisible.value = !searchVisible.value }

const categories = ref([
  { name: 'All', logo: null }, { name: 'JILI', logo: '/images/providers/logo1.jpg' }, { name: 'PP', logo: '/images/providers/logo2.jpg' }, { name: 'PG', logo: '/images/providers/logo3.jpg' }, { name: 'Pragmatic', logo: '/images/providers/logo4.jpg' }, { name: 'Live', logo: '/images/providers/logo5.jpg' }, { name: 'Fishing', logo: '/images/providers/logo6.jpg' }
])
const activeCategory = ref('All')
const filteredGames = computed(() => {
  let list = games.value
  if (activeCategory.value !== 'All') { list = list.filter(g => g.provider === activeCategory.value || g.category === activeCategory.value) }
  if (searchQuery.value) { list = list.filter(g => g.name.toLowerCase().includes(searchQuery.value.toLowerCase())) }
  return list
})
const openGame = (game) => alert(`Opening ${game.name}`)

const showDepositModal = ref(false)
const showWithdrawModal = ref(false)
const handleDepositSubmit = (data) => { addToast('Deposit request submitted!', 'success') }
const handleWithdrawSubmit = (data) => { addToast('Withdrawal request submitted!', 'success') }

const footerModal = ref(null)
const footerModalTitle = computed(() => ({ team: 'NovaBETT Team', terms: 'Terms of Service', plus18: '18+ Responsible Gaming' }[footerModal.value] || ''))
const footerModalContent = computed(() => ({ team: 'We are a passionate team...', terms: 'Please read our terms...', plus18: 'You must be 18+ to play.' }[footerModal.value] || ''))
const showFooterModal = (type) => { footerModal.value = type }
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.modal-enter-active { animation: slideUp 0.3s ease-out; }
.modal-leave-active { animation: slideUp 0.2s ease-in reverse; }
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
.animate-shimmer { background-size: 200% auto; animation: shimmer 3s linear infinite; }
.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>
