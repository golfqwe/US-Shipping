<script lang="ts" setup>
// import type { wareHouse } from '@/types/wareHouse/index'
definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})
const config = useRuntimeConfig()
let userInfo = useUserStore()
const router = useRouter()

if (process.client) {
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
}

const items = reactive({})
const currentItem = ref(Object.keys(items)[0])

const { data: listWarehouse } = await useFetch('/api/warehouse/', {
  baseURL: config.public.apiBase,
  method: 'GET',
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  },
  query: { status: 'active' },
  onResponseError ({ response }) {
    if (response.status === 401) {
      router.push({ path: '/login' })
    }
  }
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
          <v-list lines="two">
            <v-list-subheader inset>
              When you buy online. Please to below he and address for shipping to.
            </v-list-subheader>

            <v-list-item
              v-for="(dataWarehouse, inW) in it"
              :key="inW"
              :title="dataWarehouse.address"
            >
              <template #prepend>
                <v-avatar size="60" :color="`${dataWarehouse.carrier === 'Air'? 'green' :'blue'}-lighten-1`">
                  <v-icon color="white" size="x-large">
                    {{ dataWarehouse.carrier === 'Air'? 'mdi-airplane': 'mdi-sail-boat' }} {{}}
                  </v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
    </v-container>
  </v-sheet>
</template>

<style scoped></style>
