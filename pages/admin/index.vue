<script setup lang="ts">
import { useCustomFetch } from '@/composables/useCustomFetch'
import type { user } from '@/types/user/index'
definePageMeta({
  middleware: 'checkauth'
})

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const pageSize = ref(10)
const page = ref(1)
const totalCount = ref(0)
const items: user[] = reactive([])

const loading = ref(false)
const search = ref(null)

watch(page, (p) => {
  fetchData()
})
watch(pageSize, (pz) => {
  page.value = 1
  fetchData()
})

const fetchData = async () => {
  const { data: listItems } = await useCustomFetch('/api/users/', {
    method: 'GET',
    query: { page: page.value, pageSize: pageSize.value, search: search.value }
  })

  watch(listItems, (val) => {
    items.length = 0
    totalCount.value = Math.ceil(val?.count / pageSize.value)
    Object.assign(items, val?.rows)
  })
}

const onClick = () => {
  fetchData()
}

fetchData()

</script>

<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col> ข้อมูลผู้ใช้งาน </v-col>
            <v-col>
              <v-row justify="end">
                <v-col cols="8">
                  <v-text-field
                    v-model="search"
                    :loading="loading"
                    density="compact"
                    variant="solo"
                    label="Search ..."
                    append-inner-icon="mdi-magnify"
                    single-line
                    hide-details
                    @click:append-inner="onClick"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn color="info" @click="dialog = true">
                    <v-icon start>
                      mdi-plus
                    </v-icon>Add
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-title>
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">
                ::
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Full Name
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Email
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Role
              </th>

              <th class="text-subtitle-1 font-weight-bold text-center">
                status
              </th>
              <th class="text-subtitle-1 font-weight-bold text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, id) in items" :key="id" class="month-item">
              <td>
                <p class="text-15 font-weight-medium">
                  {{ item.id }}
                </p>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.name }}
                </h6>
              </td>
              <td>
                <div class="">
                  <h6 class="text-subtitle-1 font-weight-bold">
                    {{ item.email }}
                  </h6>
                  <div class="text-13 mt-1 text-muted">
                    {{ item.phone }}
                  </div>
                </div>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.role }}
                </h6>
              </td>

              <td class="text-center">
                <v-chip
                  :class="{
                    'text-body-1': true,
                    'bg-success': item.status === 'active',
                    'bg-error': item.status === 'inactive',
                  }"
                  color="white"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </td>
              <td class="text-right">
                <v-btn
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-pencil
                  </v-icon> edit
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-row justify="end" class="mt-2">
      <v-col cols="auto">
        <v-select
          v-model="pageSize"
          :items="[10, 25, 100, 250]"
          density="compact"
          variant="solo"
        />
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="page"
          :length="totalCount"
          :total-visible="7"
        />
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.status"
      :timeout="2000"
      :color="snackbar.color"
      location="top right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<style scoped>

</style>
