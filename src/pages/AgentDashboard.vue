<template>
  <div class="min-h-screen bg-[#0b141a] text-gray-200 pb-20 relative overflow-hidden">
    <!-- ... header and tabs (same as before with i18n) ... -->

    <div class="px-4 pt-6 space-y-6 relative z-10">
      <!-- Tab 0: Overview -->
      <div v-if="activeTab === 0">
        <!-- Referral Link (same) -->
        <!-- ... -->

        <!-- Stats Cards: show 0 -->
        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 text-center">
            <p class="text-3xl font-black text-cyan-300">{{ downlineStats.total }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $t('totalDownline') }}</p>
          </div>
          <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 text-center">
            <p class="text-3xl font-black text-cyan-300">{{ downlineStats.active }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $t('activeNow') }}</p>
          </div>
        </div>

        <!-- Commission: 0 -->
        <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 flex justify-between items-center mt-4">
          <span class="text-gray-400 text-sm">{{ $t('totalCommission') }}</span>
          <span class="text-cyan-300 font-black text-xl">0 Ks</span>
        </div>

        <!-- Downline List: empty -->
        <div class="bg-[#111d26] border border-cyan-500/10 rounded-2xl p-5 mt-4">
          <h3 class="font-bold text-white mb-4 flex items-center gap-2"><span>👥</span> {{ $t('yourDownline') }}</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <!-- Empty state -->
            <p class="text-center text-gray-500 py-6">No downline yet. Share your referral link to invite players.</p>
          </div>
        </div>
      </div>

      <!-- Other tabs: keep content but remove mock data, show placeholder messages -->
    </div>

    <!-- Bottom Nav (same) -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const storedUsername = localStorage.getItem('sb_username') || 'YOURNAME'
const referralLink = window.location.origin + '/?dl=' + storedUsername.toUpperCase()

const copied = ref(false)
const copyReferral = () => { /* ... same ... */ }

const activeTab = ref(0)
const tabs = [t('overview'), t('tutorial'), t('myData'), t('details'), t('searchDL')]

// Empty downline data
const downlineUsers = ref([])

const downlineStats = computed(() => ({
  total: downlineUsers.value.length,
  active: downlineUsers.value.filter(u => u.active).length
}))

const totalCommission = ref(0)

// Downline details (empty)
const downlineDetails = ref([])

const searchUsername = ref('')
const filteredDownline = computed(() => {
  if (!searchUsername.value) return []
  return downlineUsers.value.filter(u => u.username.toLowerCase().includes(searchUsername.value.toLowerCase()))
})
</script>
