<script lang="ts" setup>
import type { tracking } from '@/types/tracking/index'
definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})
const config = useRuntimeConfig()
const router = useRouter()
const userInfo = useUserStore()

if (localStorage.getItem('userInfo')) {
  userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
}

const items: tracking[] = reactive([])
const dialogImage = ref(false)
let editedTracking = reactive({})

const { data: listTracking } = await useLazyFetch('/api/trackings', {
  baseURL: config.public.apiBase,
  method: 'GET',
  query: { status: 'pending,waiting,waitpayment' },
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  },
  onResponseError ({ response }) {
    if (response.status === 401) {
      router.push({ path: '/login' })
    }
  }
})

watch(listTracking, (val) => {
  items.length = 0
  Object.assign(items, val)
})

const selectItem = (item: any) => {
  editedTracking = item
  dialogImage.value = true
}
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
      ระบบเช็ครูปสินค้า
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
                new Date(item?.createdAt).toLocaleString("th-TH")
              }}
            </h6>
          </td>
          <td>
            <h6 class="text-body-1 text-muted">
              {{
                item?.receiveDate ? new Date(item?.receiveDate).toLocaleString("th-TH") : '-'
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
            <v-btn
              v-show="item?.status?.code !== 'pending'"
              size="small"
              rounded="lg"
              color="success"
              @click="selectItem(item)"
            >
              <v-icon start dark>
                mdi-eye
              </v-icon> ดูรูป
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialogImage" max-width="750">
      <v-card>
        <v-card-title>
          <span class="text-h5">รูปพัสดุ</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="(item,inx) in editedTracking.images.split(',')"
              :key="inx"
            >
              <v-img
                :src="`${config.public.apiBase}${item}`"
                :lazy-src="`${config.public.apiBase}${item}`"
                cover
                width="100%"
                class="bg-grey-lighten-2"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-5"
                    />
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<style scoped></style>
