<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const config = useRuntimeConfig()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const formInsertDesc = ref()
const inputUser = ref()
const dialogCreateBill = ref(false)
const dialogSlip = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const listDescriptions = reactive([{
  description: '',
  quantity: 1,
  weight: 0,
  fee: 0
}])
const itemsBill = reactive([])
const itemsUsers = reactive([])
const selectUser = ref()
const userAddress = ref({})
const maxInvoice = ref(0)
const selectInvId = ref(0)
const peyment = reactive({})

const editedItem = ref({
  packages: 1,
  carrier: 'Air',
  status: 'pending'
})

watch(selectUser, async (val) => {
  if (val) {
    // on mounted

    const { data: listAddress } = await useFetch(`/api/myaddress/active/${val.id}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + userInfo?.value?.token
      }
    })
    // userAddress.splice(0)
    userAddress.value = {}
    Object.assign(userAddress.value, listAddress.value || {})
  }
})
watch(dialogCreateBill, async (val) => {
  if (val) {
    const { data: tempmaxInvoice } = await useFetch('/api/invoices/maxinvoice/', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + userInfo?.value?.token
      }
    })
    // userAddress.splice(0)
    maxInvoice.value = tempmaxInvoice.value + 1
  }
})

const addDescription = () => {
  listDescriptions.push({
    description: '',
    quantity: 1,
    weight: 0,
    fee: 0
  })
  editedItem.value.packages = listDescriptions.length
}
const close = () => {
  dialogCreateBill.value = false
}

const save = async () => {
  const { valid } = await formInsertDesc.value.validate()

  if (!valid) {
    return
  }

  if (!selectUser.value) {
    inputUser.value.focus()
    return
  }

  const { error } = await useFetch('/api/invoices/', {
    baseURL: config.public.apiBase,
    method: 'post',
    headers: {
      authorization: 'Bearer ' + userInfo?.value?.token
    },
    body: {
      saleId: userInfo?.value?.id,
      userId: selectUser?.value?.id,
      receiverId: userAddress?.value?.id,
      items: listDescriptions,
      ...editedItem.value
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

const checkSlip = async (item) => {
  selectInvId.value = item?.id
  const { data } = await useFetch(`/api/payments/${item.id}`, {
    baseURL: config.public.apiBase,
    method: 'get',
    headers: {
      authorization: 'Bearer ' + userInfo?.value?.token
    }
  })

  Object.assign(peyment, data.value)
  dialogSlip.value = true
}

const saveSlip = async () => {
  const { data } = await useFetch(`/api/payments/${peyment.id}`, {
    baseURL: config.public.apiBase,
    method: 'put',
    body: {
      invoiceId: selectInvId.value,
      status: 'success'
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

  dialogSlip.value = false
  selectInvId.value = 0
  refresh()
}
// on mounted
const { data: listUsers } = await useFetch('/api/users', {
  baseURL: config.public.apiBase,
  method: 'GET'
})
Object.assign(itemsUsers, listUsers.value)

const { data: listBills, refresh } = await useLazyFetch('/api/invoices', {
  baseURL: config.public.apiBase,
  method: 'GET',
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  },
  onResponseError ({ response }) {
    if (response.status === 401) {
      router.push({ path: '/login' })
    }
  }
})

watch(listBills, (val) => {
  console.log('🚀 ~ file: register-tracking.vue:143 ~ watch ~ val:', val)
  itemsBill.length = 0
  Object.assign(itemsBill, val)
})
</script>

<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col>  Tracking </v-col>
            <v-col cols="auto">
              <v-btn color="info" @click.stop="dialogCreateBill = true">
                <v-icon start>
                  mdi-plus
                </v-icon>
                สร้างบิลค่าขนส่ง
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">
                Inv No / Ship Number
              </th>
              <th class="text-subtitle-1 font-weight-bold text-center">
                Add On
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Receiver info
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Carrier
              </th>
              <th class="text-subtitle-1 font-weight-bold text-right">
                Packages
              </th>
              <th class="text-subtitle-1 font-weight-bold text-right">
                Amount
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                สถานะ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, id) in itemsBill"
              :key="id"
              class="month-item"
            >
              <td>
                <p class="text-15 font-weight-medium">
                  {{ item?.id }}
                </p>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{
                    item?.createdAt
                      ? new Date(item?.createdAt).toLocaleString("th-TH")
                      : "-"
                  }}
                </h6>
              </td>

              <td>
                <div class="">
                  <h6 class="text-subtitle-1 font-weight-bold">
                    {{ item?.myAddress?.contact }}
                  </h6>
                  <div class="text-13 mt-1 text-muted">
                    {{ item?.myAddress?.address
                    }}
                  </div>
                </div>
              </td>
              <td>
                <h6 class="text-body-1 text-muted text-center">
                  <v-icon
                    start
                    size="x-large"
                    :color="item?.carrier === 'Air' ? 'success' : 'blue'"
                  >
                    {{
                      item?.carrier === "Air"
                        ? "  mdi-airplane"
                        : "   mdi-sail-boat"
                    }}
                  </v-icon>
                  {{ item?.carrier }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ item?.packages || 0 }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ item?.amount.toLocaleString('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                  }) }}
                </h6>
              </td>
              <td>
                <v-chip
                  :color="`${
                    item?.status?.code === 'waiting'
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
                  v-show=" item?.status?.code === 'waiting'"
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="checkSlip(item)"
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

    <v-dialog
      v-model="dialogCreateBill"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          class="d-print-none"
          dark
          height="40"
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialogCreateBill = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>สร้างบิลค่าขนส่ง</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text class="py-0">
          <v-container>
            <v-row justify="end">
              <v-col cols="auto">
                <div class="">
                  <h2 class=" ">
                    Invoice
                  </h2>
                  <div class="text-16 mt-1 text-muted">
                    No. {{ maxInvoice }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters class="text-12">
              <v-col cols="6">
                <v-row no-gutters="">
                  <v-col cols="6" class="font-weight-bold">
                    Invoice Date:
                  </v-col>
                  <v-col cols="6">
                    {{
                      new Date().toLocaleString("th-TH")
                    }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Sale rep
                  </v-col>
                  <v-col cols="6">
                    {{ userInfo?.name }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Connact Email:
                  </v-col>
                  <v-col cols="6">
                    {{ userInfo?.email }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Due Date:
                  </v-col>
                  <v-col cols="6" />
                  <v-col cols="6" class="font-weight-bold">
                    Ship By:
                  </v-col>
                  <v-col cols="6">
                    <v-radio-group
                      v-model="editedItem.carrier"
                      inline
                      :rules="[(v) => !!v || 'Carrier is required']"
                    >
                      <v-radio label="Air Freight" value="Air">
                        <template #label>
                          <div>
                            <v-icon start size="x-large" color="success">
                              mdi-airplane
                            </v-icon>
                            <span>Air Freight</span>
                          </div>
                        </template>
                      </v-radio>
                      <v-radio value="Ocean">
                        <template #label>
                          <div>
                            <v-icon start size="x-large" color="blue">
                              mdi-sail-boat
                            </v-icon>
                            <span>Ocean Freight</span>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Packages:
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="editedItem.packages"
                      variant="outlined"
                      density="compact"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row no-gutters="">
                  <v-col cols="6" class="font-weight-bold text-right">
                    MemberID:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    <v-select
                      ref="inputUser"
                      v-model="selectUser"
                      :rules="[(v) => !!v || 'Member is required']"
                      variant="outlined"
                      :items="itemsUsers"
                      density="compact"
                      item-title="name"
                      return-object
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Contact:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ selectUser?.name }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Email:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ selectUser?.email }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Phone:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ selectUser?.phone }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right mt-4">
                    Receiver:
                  </v-col>
                  <v-col cols="6" class="pl-4 mt-4">
                    {{ userAddress?.id }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Contact:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ userAddress?.contact }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Email:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ userAddress?.email }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Phone:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ userAddress?.phone }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="my-4" />
            <v-row no-gutters="">
              <v-col cols="12">
                <v-form ref="formInsertDesc">
                  <v-table>
                    <thead>
                      <tr class="bg-grey-lighten-2">
                        <th class="text-center w-50">
                          Description
                        </th>
                        <th class="text-center">
                          Quantity
                        </th>
                        <th class="text-center">
                          Weight
                        </th>
                        <th class="text-center">
                          Fee (Bath)
                        </th>
                        <th class="text-center">
                          Total (Bath)
                        </th>
                        <th class="text-center" />
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, id) in listDescriptions" :key="id">
                        <td>
                          <v-text-field
                            v-model="item.description"
                            :rules="[(v) => !!v || 'Contact is required']"
                            hide-details="auto"
                            variant="outlined"
                            density="compact"
                            color="primary"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="item.quantity"
                            :rules="[(v) => !!v || 'Contact is required']"
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
                            :rules="[(v) => !!v || 'Contact is required']"
                            hide-details="auto"
                            variant="outlined"
                            type="number"
                            density="compact"
                            color="primary"
                          />
                        </td>
                        <td />
                        <td>
                          <v-btn v-show="listDescriptions.length > 1" icon="mdi-minus" color="error" density="compact" @click=" listDescriptions.splice(id, 1)" />
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>
                          <v-btn color="" @click="addDescription">
                            <v-icon start>
                              mdi-plus
                            </v-icon>
                            เพิ่มรายการ
                          </v-btn>
                        </td>
                      </tr>
                    </tfoot>
                  </v-table>
                </v-form>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn variant="text" text="Cancel" color="error" @click="dialogCreateBill = false" />
              </v-col>
              <v-col cols="2">
                <v-btn block text="Save" color="info" @click="save" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSlip" max-width="850">
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
                  {{ peyment?.invoiceId }}
                </v-col>
                <v-col cols="5" class="text-subtitle-1 font-weight-bold">
                  ชำระเงินเข้าบัญชี
                </v-col>
                <v-col cols="7">
                  <v-list lines="three" class="mt-n5">
                    <v-list-item class="pa-0">
                      <v-list-item-title>{{ peyment?.bookbank?.accountName }}</v-list-item-title>

                      <v-list-item-subtitle>
                        {{ peyment?.bookbank?.bankName }}    {{ peyment?.bookbank?.branch }} {{ peyment?.bookbank?.accountType }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ peyment?.bookbank?.accountNumber }}
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
          <v-btn color="success" variant="text" @click="saveSlip">
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

<style lang="scss" scoped>

</style>
