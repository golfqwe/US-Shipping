<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/count'

definePageMeta({
  layout: 'guest'
})

const inputVal = ref('')

const filtersStore = useFiltersStore()
const { addValueToFilterList } = filtersStore
const { filtersList } = storeToRefs(filtersStore)
</script>

<template>
  <div>
    <section>
      {{ filtersList }}
      <input v-model="inputVal">
      <button @click="addValueToFilterList(inputVal)">
        +
      </button>
    </section>
  </div>
</template>
