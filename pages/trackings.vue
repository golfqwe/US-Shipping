<script lang="ts" setup>
import type { tracking } from '@/types/tracking/index'
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

const items: tracking[] = reactive([])

const { data: listTracking } = await useLazyFetch('/api/trackings/', {
  baseURL: config.public.apiBase,
  method: 'GET',
  headers: {
    authorization: 'Bearer ' + userInfo?.token
  },
  onResponseError ({ response }) {
    if (response.status === 401) {
      router.push({ path: '/login' })
    }
  }
})

watch(listTracking, (val) => {
  items.slice(0)
  Object.assign(items, val)
})
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
      บิลค่าขนส่ง
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
              {{
                new Date(item?.createdAt).toLocaleString("en-US", {
                  timeZone: "UTC",
                })
              }}
            </h6>
          </td>
          <td>
            <h6 class="text-body-1 text-muted">
              {{
                item?.receiveDate ? new Date(item?.receiveDate).toLocaleString("th-TH", {
                  timeZone: "UTC",
                }) : '-'
              }}
            </h6>
          </td>

          <td>
            <h6 class="text-body-1 text-muted text-center">
              <v-icon
                start
                size="x-large"
                :color="item.carrier === 'Air' ? 'success' : 'blue'"
              >
                {{
                  item.carrier === "Air" ? "  mdi-airplane" : "   mdi-sail-boat"
                }}
              </v-icon>
              {{ item.carrier }}
            </h6>
          </td>
          <td>
            <v-chip
              :color="`${
                item?.status?.code === 'waitpayment'
                  ? 'secondary'
                  : item?.status?.code === 'paymented'
                    ? 'info'
                    : item?.status?.code === 'waiting'
                      ? 'warning'
                      : item?.status?.code === 'success'
                        ? 'success'
                        : 'accent'
              }`"
            >
              {{ item.status.desc }}
            </v-chip>
          </td>
          <td class="text-right">
            <v-tooltip
              location="bottom"
            >
              <template #activator="{ props }">
                <v-btn
                  v-show=" item?.status?.code === 'waitpayment'"
                  icon
                  v-bind="props"
                  variant="text"
                  :to="`/payment/${item.id}`"
                >
                  <v-icon color="info">
                    mdi-cash
                  </v-icon>
                </v-btn>
              </template>
              <span>ชำละบิล</span>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>

<style scoped></style>
