<script setup lang="ts">
import type { tracking } from '@/types/tracking/index'
// import { invoiceItem } from '@/types/invoiceItem/index'
definePageMeta({
  middleware: 'checkauth'
})

const config = useRuntimeConfig()
const userInfo = useUserStore()
const router = useRouter()

if (localStorage.getItem('userInfo')) {
  userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
}

const dialog = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const items: tracking[] = reactive([])

const editedItem = reactive({})
const peyment = reactive({})

const { data: listItems, refresh } = await useLazyFetch('/api/trackings', {
  baseURL: config.public.apiBase,
  method: 'GET',
  query: { status: 'waitpayment,paymented' },
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  },
  onResponseError ({ response }) {
    if (response.status === 401) {
      router.push({ path: '/login' })
    }
  }
})

watch(listItems, (val) => {
  console.log('🚀 ~ file: payment.vue:42 ~ watch ~ val:', val)
  items.length = 0
  Object.assign(items, val)
})

watch(dialog, (val) => {
  val || close()
})

const editItem = async (item: any) => {
  const { data } = await useFetch(`/api/payments/${item.id}`, {
    baseURL: config.public.apiBase,
    method: 'get',
    headers: {
      authorization: 'Bearer ' + userInfo?.value?.token
    }
  })

  Object.assign(peyment, data.value)
  Object.assign(editedItem, item)
  dialog.value = true
}
const close = async () => {
  dialog.value = false
  await nextTick(() => {
    Object.assign(editedItem, {})
  })
}
const save = async () => {
  const { data } = await useFetch(`/api/trackings/${editedItem.id}`, {
    baseURL: config.public.apiBase,
    method: 'put',
    body: {
      status: 'waiting'
    },
    headers: {
      authorization: 'Bearer ' + userInfo?.value?.token
    }
  })
  if (data.value) {
    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
  }
  snackbar.status = true

  close()
  refresh()
}

</script>
<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col> แจ้งชำระบิล </v-col>
          </v-row>
        </v-card-title>
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">
                ::
              </th>
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
            <tr v-for="(item, id) in items" :key="id" class="month-item">
              <td>
                <p class="text-15 font-weight-medium">
                  {{ item.id }}
                </p>
              </td>
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
                    new Date(item?.createdAt).toLocaleString("en-US")
                  }}
                </h6>
              </td>
              <td>-</td>

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
                            : ''
                  }`"
                >
                  {{ item?.status?.desc }}
                </v-chip>
              </td>

              <td class="text-right">
                <v-btn
                  v-show=" item?.status?.code === 'paymented'"
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-cash-check
                  </v-icon> ตรวจสอบสลิป
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-dialog v-model="dialog" max-width="850">
      <v-card>
        <v-card-title>
          <span class="text-h5">ตรวจสอบสลิป</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-row>
                <v-col cols="5" class="text-subtitle-1 font-weight-bold">
                  Inovice No
                </v-col>
                <v-col cols="7">
                  {{ peyment.invoiceId }}
                </v-col>
                <v-col cols="5" class="text-subtitle-1 font-weight-bold">
                  ชำระเงินเข้าบัญชี
                </v-col>
                <v-col cols="7">
                  <v-list lines="three" class="mt-n5">
                    <v-list-item class="pa-0">
                      <v-list-item-title>{{ peyment?.BookBankModel?.accountName }}</v-list-item-title>

                      <v-list-item-subtitle>
                        {{ peyment?.BookBankModel?.bankName }}    {{ peyment?.BookBankModel?.branch }} {{ peyment?.BookBankModel?.accountType }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ peyment?.BookBankModel?.accountNumber }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="5" class="text-subtitle-1 font-weight-bold">
                  Amount Paid
                </v-col>
                <v-col cols="7">
                  {{ peyment.amount.toLocaleString('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                  }) }}
                </v-col>
                <v-col cols="5" class="text-subtitle-1 font-weight-bold">
                  วันเวลาที่ชำระเงิน
                </v-col>
                <v-col cols="7">
                  {{
                    peyment?.payDate ? new Date(peyment?.payDate).toLocaleString("th-TH") : '-'
                  }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="6"
            >
              <div class="mx-4">
                <div class="text-subtitle-1 pb-2">
                  หลักฐานการโอนเงิน
                </div>
                <v-img
                  class="bg-white"
                  :aspect-ratio="1"
                  :src="`${config.public.apiBase}${peyment.slipImage}`"
                  :lazy-src="`${config.public.apiBase}${peyment.slipImage}`"
                  cover
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="success" variant="text" @click="save">
            ข้อมูลถูกต้อง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
