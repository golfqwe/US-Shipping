<script setup lang="ts">
import type { tracking } from '@/types/tracking/index'
import { invoiceItem } from '@/types/invoiceItem/index'
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
const formDescription = ref()
const items: tracking[] = reactive([])
let selectDescription:invoiceItem[] = reactive([])
const defaultDescription: invoiceItem[] = reactive([
  {
    id: 1,
    description: 'Net Weight',
    quantity: 1,
    weight: 0,
    fee: 0
  },
  {
    id: 2,
    description: 'Shipping Free Air Long Cargo(L) (Retail)',
    quantity: 1,
    weight: 0,
    fee: 0
  },
  {
    id: 3,
    description: 'Volume Weight Charge',
    quantity: 1,
    weight: 0,
    fee: 0
  },
  {
    id: 4,
    description: 'Transit Charge',
    quantity: 1,
    weight: 0,
    fee: 0
  },
  {
    id: 5,
    description: 'Consolideate/Repack Fee',
    quantity: 1,
    weight: null,
    fee: 70
  },
  {
    id: 6,
    description: 'Local Deliver in Capital 1-15.9 kg',
    quantity: 1,
    weight: null,
    fee: 70
  }
])

const editedIndex = ref(-1)
let editedItem = reactive({})

const { data: listItems, refresh } = await useLazyFetch('/api/trackings', {
  baseURL: config.public.apiBase,
  method: 'GET',
  query: { status: 'success' },
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
  console.log('🚀 ~ file: trackings.vue:88 ~ watch ~ val:', val)
  items.length = 0
  Object.assign(items, val)
})

watch(dialog, (val) => {
  val || close()
})

const editItem = (item: any) => {
  editedIndex.value = item.id
  editedItem = item
  selectDescription = reactive([])
  dialog.value = true
}
const close = async () => {
  dialog.value = false
  await nextTick(() => {
    editedIndex.value = -1
  })
}
const save = async () => {
  const { valid } = await formDescription.value.validate()

  if (!valid) {
    return
  }

  const { error } = await useFetch('/api/invoices/', {
    baseURL: config.public.apiBase,
    method: 'post',
    headers: {
      authorization: 'Bearer ' + userInfo?.value?.token
    },
    body: {
      trackingId: editedItem?.id,
      userId: editedItem?.userId,
      status: 'pending',
      items: selectDescription
    }
  })
  if (error.value) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
  } else {
    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
  }
  snackbar.status = true

  close()
  refresh()
}
const toggleActive = (item: invoiceItem) => {
  const pos = selectDescription.findIndex(it => it.id === item.id)
  pos === -1 ? selectDescription.push(item) : selectDescription.splice(pos, 1)
}
</script>
<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col>  Tracking </v-col>
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
                    item?.createdAt ? new Date(item?.createdAt).toLocaleString("th-TH") : '-'
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
                      ? 'info'
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
                  v-show=" item?.status?.code === 'pending'"
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-receipt
                  </v-icon> สร้างบิล
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">บิลค่าขนส่ง</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="5">
                <v-list>
                  <v-list-item
                    v-for="(item, idx) in defaultDescription"
                    :key="idx"
                    :active="selectDescription.some((it) => it === item)"
                    color="primary"
                    @click="toggleActive(item)"
                  >
                    <v-list-item-title>{{ item.description }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="">
                <v-form ref="formDescription">
                  <v-table class="month-table">
                    <thead>
                      <tr>
                        <th class="text-subtitle-1 font-weight-bold w-50">
                          description
                        </th>
                        <th class="text-subtitle-1 font-weight-bold text-center">
                          quantity
                        </th>
                        <th class="text-subtitle-1 font-weight-bold">
                          weight
                        </th>
                        <th class="text-subtitle-1 font-weight-bold">
                          fee (Bath)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, id) in selectDescription" :key="id">
                        <td>
                          <v-text-field
                            v-model="item.description"
                            :rules="[(v: string) => !!v || 'Contact is required']"
                            hide-details="auto"
                            variant="outlined"
                            density="compact"
                            color="primary"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="item.quantity"
                            :rules="[(v: string) => !!v || 'Contact is required']"
                            hide-details="auto"
                            type="number"
                            variant="outlined"
                            density="compact"
                            color="primary"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="item.weight"
                            hide-details="auto"
                            variant="outlined"
                            type="number"
                            density="compact"
                            color="primary"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="item.fee"
                            :rules="[(v: string) => !!v || 'Contact is required']"
                            hide-details="auto"
                            variant="outlined"
                            type="number"
                            density="compact"
                            color="primary"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <small class="text-red">*indicates required field</small>
          <v-spacer />
          <v-btn color="error" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
            Save
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
