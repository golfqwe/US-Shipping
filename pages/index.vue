<script setup lang="ts">
/* -For Set Blank Layout- */
definePageMeta({
  layout: 'guest'
})
const userInfo = useUserStore()

</script>

<template>
  <v-content>
    <section>
      <h2>WWF History</h2>
      <p>
        {{ userInfo }}
      </p>
    </section>
  </v-content>
</template>
