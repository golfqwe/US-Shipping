<script setup lang="ts">
/* -For Set Blank Layout- */

definePageMeta({
  layout: 'guest'
})

// let userInfo = useUserStore()
// if (process.client) {
//   userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
// }
</script>

<template>
  <v-content>
    <section>
      <h2>WWF History</h2>
      <p>
        <!-- {{ userInfo }} -->
      </p>
    </section>
  </v-content>
</template>
