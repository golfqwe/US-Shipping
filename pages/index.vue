<script setup lang="ts">
import { useCustomFetch } from '@/composables/useCustomFetch'

definePageMeta({
  layout: 'guest'
})
const items = reactive([])

const { data: listAddress } = await useCustomFetch('/api/archives', {
  method: 'GET',
  params: { type: 'home' }
})
watch(listAddress, (val) => {
  items.length = 0
  Object.assign(items, val)
})
</script>

<template>
  <div>
    <v-sheet id="content" class="pa-6" color="white" rounded>
      <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
        หน้าแรก
      </h5>
      <v-row v-for="(item, inx) in items" :key="inx">
        <v-col>
          <span class="ck-content" v-html="item.content" />
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<style>

</style>
