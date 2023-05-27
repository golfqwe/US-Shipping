<script setup lang="ts">
import type { Archive } from '@/types/archive/index'
definePageMeta({
  layout: 'guest'
})

const items: Archive[] = reactive([])

const { data: listAddress } = await useFetch('/api/archives/', {
  method: 'GET',
  params: { type: 'auction' }
})
Object.assign(items, listAddress.value)
</script>

<template>
  <v-content>
    <v-sheet class="pa-6" color="white" rounded>
      <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
        บริการรับกดสั่งสินค้า ประมูลสินค้า
      </h5>
      <section v-for="(item, inx) in items" :key="inx">
        <span class="customImage" v-html="item.content" />
      </section>
    </v-sheet>
  </v-content>
</template>
