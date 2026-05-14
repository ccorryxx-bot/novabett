<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 pb-20 relative overflow-hidden">
    <!-- ... header and content same as before ... -->

    <!-- Bottom Nav (SVG icons) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0b141a]/95 backdrop-blur-xl border-t border-cyan-500/10 z-40">
      <div class="flex justify-around items-center py-2">
        <router-link to="/home" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span class="text-[10px]">Home</span>
        </router-link>
        <router-link to="/promotions" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 12v8H4v-8l8-8 8 8zm-2 2H6v4h12v-4zM12 2l-8 8h16l-8-8z"/></svg>
          <span class="text-[10px]">Promos</span>
        </router-link>
        <router-link to="/agent" class="flex flex-col items-center gap-0.5 text-cyan-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span class="text-[10px]">Agents</span>
        </router-link>
        <router-link to="/service" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span class="text-[10px]">Chat</span>
        </router-link>
        <router-link to="/account" class="flex flex-col items-center gap-0.5 text-gray-400 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span class="text-[10px]">You</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const storedUsername = localStorage.getItem('sb_username') || 'YOURNAME'
const referralLink = window.location.origin + '/?dl=' + storedUsername.toUpperCase()

const copied = ref(false)
const copyReferral = () => { /* ... same ... */ }

const activeTab = ref(0)
const tabs = ['Overview', 'Tutorial', 'My Data', 'Details', 'Search']

const downlineUsers = ref([ /* ... same data ... */ ])
const downlineStats = computed(() => { /* ... */ })
const totalCommission = ref(125000)
const downlineDetails = ref([ /* ... */ ])
const searchUsername = ref('')
const filteredDownline = computed(() => { /* ... */ })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
