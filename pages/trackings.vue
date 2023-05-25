<script lang="ts" setup>
import type { tracking } from '@/types/tracking/index'
definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})
const items:tracking[] = reactive([])

const { data: listProducts } = await useFetch('/api/trackings/', {
  method: 'GET'
})
Object.assign(items, listProducts.value)
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
      บิลนำเข้าสินค้า
    </h5>

    <v-table class="month-table">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-bold">
            Tracking No
          </th>
          <th class="text-subtitle-1 font-weight-bold text-center">
            จำนวนกล่อง
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            วันที่แจ้งส่ง
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            วันที่สินค้าถึงโกดัง
          </th>
          <th class="text-subtitle-1 font-weight-bold text-right">
            ประเภทจัดส่ง
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            สถานะ
          </th>
          <th class="text-subtitle-1 font-weight-bold text-right">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" class="month-item">
          <td>
            <p class="text-15 font-weight-medium">
              {{ item.trackingNumber }}
            </p>
          </td>
          <td>
            <h6 class="text-subtitle-1 font-weight-bold text-center">
              {{ 1 }}
            </h6>
          </td>
          <td>
            <h6 class="text-body-1 text-muted">
              {{ new Date(item?.createdAt).toLocaleString('en-US', { timeZone: 'UTC' }) }}
            </h6>
          </td>
          <td>
            -
          </td>

          <td>
            <h6 class="text-body-1 text-muted text-center">
              <v-icon
                start
                size="x-large"
                :color="item.carrier === 'Air' ? 'success' : 'blue'"
              >
                {{
                  item.carrier === "Air"
                    ? "  mdi-airplane"
                    : "   mdi-sail-boat"
                }}
              </v-icon>
              {{ item.carrier }}
            </h6>
          </td>
          <td>
            <v-chip :color="`${item.status?.code === 'payment'? 'info' : item.status?.code === 'waiting'? 'warning' : item.status?.code === 'success'? 'success' : ''}`">
              {{ item.status.desc }}
            </v-chip>
          </td>
          <td class="text-right">
            <v-btn variant="text" color="success" icon="mdi-pencil-box-outline" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>

<style scoped></style>
