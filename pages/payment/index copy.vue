<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { invoiceItem } from '@/types/invoiceItem/index'
import { invoice } from '@/types/invoice/index'
import { payment } from '@/types/payment/index'
import { MyAddress } from '@/types/myAddress/index'
import { BookBank } from '@/types/bookbank/index'

// const route = useRoute()
const config = useRuntimeConfig()
const router = useRouter()
const userInfo = useUserStore()

if (localStorage.getItem('userInfo')) {
  userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
}

definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})

const formPayment = ref()
const { smAndDown } = useDisplay()
let invoiceItems: invoiceItem[] = reactive([])
const invoiceInfo: invoice = reactive({})
let paymentData: payment = reactive({})
const addressList: MyAddress[] = reactive([])
const bookbankList: BookBank[] = reactive([])
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const { data: listBills } = await useLazyFetch('/api/invoices', {
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
// Object.assign(invoiceItems, invoiceList.value.InvoiceItemsModels)

const { data: addressData } = await useFetch('/api/myAddress/', {
  method: 'GET',
  baseURL: config.public.apiBase,
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  }
})
Object.assign(addressList, addressData.value)
const { data: bookbankData } = await useFetch('/api/bookbank/', {
  method: 'GET',
  baseURL: config.public.apiBase,
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  }
})
Object.assign(bookbankList, bookbankData.value)

paymentData = reactive({
  invoiceId: invoiceInfo.id,
  bankId: null,
  amount: 0,
  payDate: null,
  slipImage: [],
  receiverId: addressList.find(it => it.id === invoiceInfo.receiverId)
})

const calculateTotal = (it : invoiceItem) => {
  return ((it.fee * (it.weight === 0 || !it.weight ? 1 : it.weight)) * it.quantity)
}
invoiceItems = invoiceList.value.invoiceItems.map(it => ({ ...it, total: calculateTotal(it) }))
const sumTotal = (array, key: string) => array.reduce((sum, acc) => sum + Number(acc[key]), 0)

const save = async () => {
  const { valid } = await formPayment.value.validate()

  if (!valid) {
    return
  }

  const formData = new FormData()
  formData.append('trackingId', invoiceInfo.trackingId)
  paymentData.slipImage.forEach((it) => {
    formData.append('photo', it, it.name)
  })

  try {
    const { data: resFile } = await useFetch('/api/upload/slip/', {
      method: 'post',
      baseURL: config.public.apiBase,
      headers: {
        authorization: 'Bearer ' + userInfo?.value?.token
      },
      body: formData
    })

    const { data } = await useFetch('/api/payments/', {
      method: 'post',
      baseURL: config.public.apiBase,
      headers: {
        authorization: 'Bearer ' + userInfo?.value?.token
      },
      body: {
        trackingId: invoiceInfo.trackingId,
        invoiceId: paymentData.invoiceId,
        bankId: paymentData.bankId?.id,
        amount: paymentData.amount,
        payDate: paymentData.payDate,
        slipImage: resFile?.value?.pathFile,
        status: 'pending'
      }
    })
    if (!data.value) {
      snackbar.text = 'Save data failed'
      snackbar.color = 'error'
    } else {
      snackbar.text = 'Save data successfully'
      snackbar.color = 'success'
      formPayment.value.reset()
      navigateTo('/trackings')
    }
    snackbar.status = true
  } catch (error) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
    snackbar.status = true
  }
}

</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
      ดำเนินการชำระเงิน
    </h5>

    <v-row>
      <v-col sm="12" md="7">
        <v-table>
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold w-50">
                Description
              </th>
              <th class="text-subtitle-1 font-weight-bold ">
                Quantity
              </th>
              <th class="text-subtitle-1 font-weight-bold ">
                Weight
              </th>
              <th class="text-subtitle-1 font-weight-bold ">
                Fee (Bath)
              </th>
              <th class="text-subtitle-1 font-weight-bold ">
                Total (Bath)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, inx) in invoiceItems"
              :key="inx"
            >
              <td>
                <h6 class="text-subtitle-1 font-weight-bold ">
                  {{ item.description }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted text-center">
                  {{ item.quantity }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted text-center">
                  {{ item.weight }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted text-center">
                  {{ item.fee }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.total.toLocaleString('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                  }) }}
                </h6>
              </td>
            </tr>
            <tr>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  Total
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ sumTotal(invoiceItems||[],'quantity') }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ sumTotal(invoiceItems||[],'weight').toFixed(2) }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ sumTotal(invoiceItems||[],'fee').toFixed(2) }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ sumTotal(invoiceItems||[],'total').toLocaleString('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                  }) }}
                </h6>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-divider
        :vertical="!smAndDown"
      />
      <v-col>
        <v-form ref="formPayment">
          <v-row align="center">
            <v-col cols="auto">
              <v-label class="font-weight-bold mb-1">
                Inovice No
              </v-label>
            </v-col>
            <v-col>
              <v-text-field
                v-model="paymentData.invoiceId"
                disabled
                variant="outlined"
                hide-details="auto"
                color="primary"
              />
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="auto">
              <v-label class="font-weight-bold mb-1">
                Receiver
              </v-label>
            </v-col>
            <v-col>
              <v-select
                v-model="paymentData.receiverId"
                :rules="[(v) => !!v || 'Receiver is required']"
                :items="addressList"
                variant="outlined"
                hide-details="auto"
                color="primary"
              >
                <template #selection="{ item }">
                  <span>{{ item.value?.contact }}</span>
                </template>
                <template #item="{ props, item: {value} }">
                  <v-list-item
                    v-bind="props"
                    :title="value?.contact"
                    :subtitle="value?.address"
                  />
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="auto">
              <v-label class="font-weight-bold mb-1">
                ชำระเงินเข้าบัญชี
              </v-label>
            </v-col>
            <v-col>
              <v-select
                v-model="paymentData.bankId"
                :rules="[(v) => !!v || 'Bank is required']"
                :items="bookbankList"
                variant="outlined"
                hide-details="auto"
                color="primary"
              >
                <template #selection="{ item }">
                  <span>{{ item.value?.accountNumber }}</span>
                </template>
                <template #item="{ props, item: {value} }">
                  <v-list-item
                    v-bind="props"
                    :title="`${value?.bankName} ${value?.accountType}`"
                    :subtitle="value?.accountName"
                  />
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="auto">
              <v-label class="font-weight-bold mb-1">
                Amount Paid <span class="text-red">*</span>
              </v-label>
            </v-col>
            <v-col cols="auto">
              <v-text-field
                v-model="paymentData.amount"
                :rules="[(v) => !!v || 'Amount Paid is required']"
                variant="outlined"
                type="number"
                hide-details="auto"
                color="primary"
              />
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="auto">
              <v-label class="font-weight-bold mb-1">
                วันเวลาที่ชำระเงิน
              </v-label>
            </v-col>
            <v-col>
              <v-text-field
                v-model="paymentData.payDate"
                :rules="[(v) => !!v || 'Date Paid is required']"
                variant="outlined"
                type="datetime-local"
                hide-details="auto"
                color="primary"
              />
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="auto">
              <v-label class="font-weight-bold mb-1">
                หลักฐานการโอนเงิน
              </v-label>
            </v-col>
            <v-col>
              <v-file-input
                v-model="paymentData.slipImage"
                variant="outlined"
                :rules="[(v) => !!v.length || 'Slip images is required']"
                accept="image/*"
              />
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-btn block color="primary" @click="save">
                แจ้งชำระเงิน
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
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
  </v-sheet>
</template>

<style scoped>
</style>
