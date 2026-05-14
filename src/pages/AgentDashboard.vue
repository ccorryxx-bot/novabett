<script setup>
// ... existing imports and states ...

const storedUsername = localStorage.getItem('sb_username') || 'YOURNAME'
// Dynamic referral link
const referralLink = window.location.origin + '/?dl=' + storedUsername.toUpperCase()

// ... rest unchanged ...
</script>
