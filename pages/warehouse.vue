<script lang="ts" setup>
// import type { wareHouse } from '@/types/wareHouse/index'
definePageMeta({
  layout: 'guest'
})

const items = reactive({})
const currentItem = ref(Object.keys(items)[0])

const { data: listWarehouse } = await useFetch('/api/warehouse/', {
  method: 'GET',
  query: { status: 'active' }
})

const groupBy = (objectArray: [], groupKey: string) => {
  return objectArray.sort((a, b) => {
    if (a.country > b.country) {
      return 1
    }
    if (b.country > a.country) {
      return -1
    }
    return 0
  }).reduce((acc, obj) => {
    const key = obj[groupKey]
    const curGroup = acc[key] ?? []
    return { ...acc, [key]: [...curGroup, obj] }
  }, {})
}

Object.assign(items, groupBy(listWarehouse.value as [], 'country'))

</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <v-row no-gutters>
      <v-tabs
        v-model="currentItem"
        color="primary"
      >
        <v-tab
          v-for="(it,ind) in items"
          :key="ind"
          :value="ind"
        >
          {{ ind }}
        </v-tab>
      </v-tabs>
    </v-row>
    <v-container>
      <v-window v-model="currentItem">
        <v-window-item
          v-for="(it,ind) in items"
          :key="ind"
          :value="ind"
        >
          {{ it }}
        </v-window-item>
      </v-window>
    </v-container>
  </v-sheet>
</template>

<style scoped></style>
