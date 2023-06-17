<script setup lang="ts">
import type { Archive } from '@/types/archive/index'
import { useCustomFetch } from '@/composables/useCustomFetch'

definePageMeta({
  layout: 'guest'
})
const items: Archive[] = reactive([])

const { data: listAddress } = await useCustomFetch('/api/archives/', {
  method: 'GET',
  params: { type: 'customService' }
})

watch(listAddress, (val) => {
  items.length = 0
  Object.assign(items, val)
})
</script>

<template>
  <div>
    <v-sheet class="pa-6" color="white" rounded>
      <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
        ติดต่อเจ้าหน้าที่
      </h5>
      <section v-for="(item, inx) in items" :key="inx">
        <span class="customImage" v-html="item.content" />
      </section>
    </v-sheet>
  </div>
</template>
