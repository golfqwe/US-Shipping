<script lang="ts" setup>
definePageMeta({
  layout: 'guest'
})
const tab = ref(0)
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <v-row no-gutters>
      <v-tabs
        v-model="tab"
        color="primary"
      >
        <v-tab value="one">
          Item One
        </v-tab>
        <v-tab value="two">
          Item Two
        </v-tab>
        <v-tab value="three">
          Item Three
        </v-tab>
      </v-tabs>
    </v-row>
    <v-container>
      <v-window v-model="tab">
        <v-window-item value="one">
          One
        </v-window-item>

        <v-window-item value="two">
          Two
        </v-window-item>

        <v-window-item value="three">
          Three
        </v-window-item>
      </v-window>
    </v-container>
  </v-sheet>
</template>

<style scoped></style>
