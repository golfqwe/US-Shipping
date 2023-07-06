<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BookBank } from '@/types/bookbank/index'

import { useUserStore } from '@/stores/user'
import { useCustomFetch } from '@/composables/useCustomFetch'

definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})

const config = useRuntimeConfig()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const formPayment = ref()
const itemsBill = reactive([])
const dialogBill = ref(false)
const dialogPayment = ref(false)
const billDetail = ref({})
const bookbankList: BookBank[] = reactive([])

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const paymentData = reactive({
  invoiceId: null,
  bankId: null,
  amount: 0,
  payDate: null,
  slipImage: []
})

const { data: bookbankData } = await useCustomFetch('/api/bookbank/', {
  method: 'GET'
})

watch(bookbankData, (val) => {
  bookbankList.length = 0
  Object.assign(bookbankList, val)
})
watch(dialogPayment, (val) => {
  if (val) {
    paymentData.amount = parseFloat(sumTotal(billDetail.value.invoiceItems || [], 'total').toLocaleString().replace(/,/g, ''))
  }
})

const calculateTotal = (it) => {
  return (it.fee * +(it.weight || 1))
}
const sumTotal = (array, key: string) => array.reduce((sum, acc) => sum + Number(acc[key]), 0)

const editItem = async (item: any) => {
  const { data: bill } = await useFetch(`/api/invoices/${item?.id}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    headers: {
      authorization: 'Bearer ' + userInfo?.value?.token
    }
  })

  billDetail.value = Object.create({})
  Object.assign(billDetail.value, bill.value || {})
  paymentData.invoiceId = billDetail?.value?.id
  billDetail.value.invoiceItems = billDetail.value.invoiceItems.map(it => ({ ...it, total: calculateTotal(it) }))

  dialogBill.value = true
}

const { data: listBills, refresh } = await useCustomFetch('/api/invoices/user/', {
  method: 'GET'
})

watch(listBills, (val) => {
  itemsBill.length = 0
  Object.assign(itemsBill, val)
})

const savePayment = async () => {
  const { valid } = await formPayment.value.validate()

  if (!valid) {
    return
  }

  const formData = new FormData()
  formData.append('invId', paymentData?.invoiceId)
  paymentData.slipImage.forEach((it) => {
    formData.append('photo', it, it.name)
  })

  try {
    const { data: resFile } = await useCustomFetch('/api/upload/slip/', {
      method: 'post',
      body: formData
    })

    const { data } = await useFetch('/api/payments/', {
      method: 'post',
      baseURL: config.public.apiBase,
      headers: {
        authorization: 'Bearer ' + userInfo?.value?.token
      },
      body: {
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
    }
    dialogBill.value = false
    dialogPayment.value = false
    snackbar.status = true
    refresh()
  } catch (error) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
    snackbar.status = true
  }
}

</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <h5 id="content" class="text-h5 font-weight-bold mb-4 text-darkprimary">
      บิลค่าขนส่ง
    </h5>

    <v-row>
      <v-col>
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
              <th class="text-subtitle-1 font-weight-bold" />
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
              <td>
                <v-btn
                  v-show=" item?.status?.code === 'pending'"
                  size="small"
                  rounded="lg"
                  color="success"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-cash-check
                  </v-icon> paynow
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogBill"
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
            @click="dialogBill = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>รายละเอียดบิลค่าขนส่ง</v-toolbar-title>
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
                    No. {{ billDetail?.id }}
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
                      billDetail?.createdAt ? new Date(billDetail?.createdAt).toLocaleString("th-TH") : '-'
                    }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Sale rep
                  </v-col>
                  <v-col cols="6">
                    {{ billDetail?.sale?.name }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Connact Email:
                  </v-col>
                  <v-col cols="6">
                    {{ billDetail?.sale?.email }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Due Date:
                  </v-col>
                  <v-col cols="6" />
                  <v-col cols="6" class="font-weight-bold">
                    Ship By:
                  </v-col>
                  <v-col cols="6">
                    <v-icon
                      start
                      size="x-large"
                      :color="billDetail?.carrier === 'Air' ? 'success' : 'blue'"
                    >
                      {{
                        billDetail?.carrier === "Air"
                          ? "  mdi-airplane"
                          : "   mdi-sail-boat"
                      }}
                    </v-icon>
                    {{ billDetail?.carrier }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold">
                    Packages:
                  </v-col>
                  <v-col cols="6">
                    {{ billDetail?.packages }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row no-gutters="">
                  <v-col cols="6" class="font-weight-bold text-right">
                    MemberID:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ billDetail?.user?.name }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Contact:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ billDetail?.user?.name }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Email:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ billDetail?.user?.email }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Phone:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ billDetail?.user?.phone }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right mt-4">
                    Receiver:
                  </v-col>
                  <v-col cols="6" class="pl-4 mt-4">
                    {{ billDetail?.myAddress?.id }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Contact:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ billDetail?.myAddress?.contact }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Email:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ billDetail?.myAddress?.email }}
                  </v-col>
                  <v-col cols="6" class="font-weight-bold text-right">
                    Phone:
                  </v-col>
                  <v-col cols="6" class="pl-4">
                    {{ billDetail?.myAddress?.phone }}
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
                      <tr v-for="(item, id) in billDetail.invoiceItems" :key="id">
                        <td>
                          <p class="text-15 font-weight-medium">
                            {{ item.description }}
                          </p>
                        </td>
                        <td>
                          <p class="text-subtitle-1 text-center">
                            {{ item.quantity }}
                          </p>
                        </td>
                        <td>
                          <p class="text-subtitle-1 text-center">
                            {{ item.weight }}
                          </p>
                        </td>
                        <td>
                          <p class="text-subtitle-1 text-center">
                            {{ item?.fee.toLocaleString('th-TH', {
                              style: 'currency',
                              currency: 'THB',
                            }) }}
                          </p>
                        </td>
                        <td>
                          <p class="text-subtitle-1 text-center">
                            {{ item?.total.toLocaleString('th-TH', {
                              style: 'currency',
                              currency: 'THB',
                            }) }}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>
                          <h6 class="text-subtitle-1 font-weight-bold text-center">
                            Total
                          </h6>
                        </td>
                        <td>
                          <h6 class="text-subtitle-1 font-weight-bold text-center">
                            {{ sumTotal(billDetail.invoiceItems||[],'quantity') }}
                          </h6>
                        </td>
                        <td>
                          <h6 class="text-subtitle-1 font-weight-bold text-center">
                            {{ sumTotal(billDetail.invoiceItems||[],'weight').toFixed(2) }}
                          </h6>
                        </td>
                        <td>
                          <h6 class="text-subtitle-1 font-weight-bold text-center">
                            {{ sumTotal(billDetail.invoiceItems||[],'fee').toLocaleString('th-TH', {
                              style: 'currency',
                              currency: 'THB',
                            }) }}
                          </h6>
                        </td>
                        <td>
                          <h6 class="text-subtitle-1 font-weight-bold text-center">
                            {{ sumTotal(billDetail.invoiceItems||[],'total').toLocaleString('th-TH', {
                              style: 'currency',
                              currency: 'THB',
                            }) }}
                          </h6>
                        </td>
                      </tr>
                    </tfoot>
                  </v-table>
                </v-form>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn variant="text" text="Cancel" color="error" @click="dialogBill = false" />
              </v-col>
              <v-col cols="2">
                <v-btn block text="ชำระบิล" color="info" @click="dialogPayment = true" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogPayment"
      width="700"
    >
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formPayment">
              <v-row align="center">
                <v-col cols="auto">
                  <v-label class="font-weight-bold mb-1">
                    Inovice No
                  </v-label>
                </v-col>
                <v-col>
                  <div class="text-16 mt-1 text-muted">
                    No. {{ paymentData.invoiceId }}
                  </div>
                </v-col>
              </v-row>
              <!-- <v-row align="center">
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
          </v-row> -->
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
                    :rules="[(v) => !!(v && v.length) || 'Slip images is required']"
                    accept="image/*"
                  />
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col>
                  <v-btn block color="primary" @click="savePayment">
                    แจ้งชำระเงิน
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
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
  </v-sheet>
</template>

<style scoped>
</style>
