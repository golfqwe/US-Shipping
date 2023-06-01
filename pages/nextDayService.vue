<script setup lang="ts">
import type { Archive } from '@/types/archive/index'
definePageMeta({
  layout: 'guest'
})

const items: Archive[] = reactive([])

const { data: listAddress } = await useFetch('/api/archives', {
  method: 'GET',
  params: { type: 'nextDayService' }
})
Object.assign(items, listAddress.value)
</script>

<template>
  <v-content>
    <v-sheet class="pa-6" color="white" rounded>
      <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
        รอบนำเข้าสินค้า
      </h5>
      <v-row v-for="(item, inx) in items" :key="inx">
        <v-col>
          <span class="customImage" v-html="item.content" />
        </v-col>
      </v-row>
    </v-sheet>
  </v-content>
</template>

<style>
.customImage img {
  width: 100% !important;
}

</style>
