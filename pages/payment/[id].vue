<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { invoiceItem } from '@/types/invoiceItem/index'
import { invoice } from '@/types/invoice/index'
import { payment } from '@/types/payment/index'
import { MyAddress } from '@/types/myAddress/index'
import { BookBank } from '@/types/bookbank/index'

const route = useRoute()

definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})

const { smAndDown } = useDisplay()
let invoiceItems: invoiceItem[] = reactive([])
const invoiceInfo: invoice = reactive({})
let paymentData: payment = reactive({})
const addressList: MyAddress[] = reactive([])
const bookbankList: BookBank[] = reactive([])

const { data: invoiceList } = await useFetch(`/api/invoices/${route.params.id}`, {
  method: 'GET'
})
// Object.assign(invoiceItems, invoiceList.value.InvoiceItemsModels)

Object.assign(invoiceInfo, invoiceList.value)

const { data: addressData } = await useFetch('/api/myAddress/', {
  method: 'GET'
})
Object.assign(addressList, addressData.value)
const { data: bookbankData } = await useFetch('/api/bookBank/', {
  method: 'GET'
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
invoiceItems = invoiceList.value.InvoiceItemsModels.map(it => ({ ...it, total: calculateTotal(it) }))
const sumTotal = (array, key: string) => array.reduce((sum, acc) => sum + Number(acc[key]), 0)

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
                  {{ item.total.toFixed(2) }}
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
                  {{ sumTotal(invoiceItems,'quantity') }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ sumTotal(invoiceItems,'weight').toFixed(2) }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ sumTotal(invoiceItems,'fee').toFixed(2) }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold text-center">
                  {{ sumTotal(invoiceItems,'total').toFixed(2) }}
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
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="auto">
            <v-label class="font-weight-bold mb-1">
              ที่อยู่
            </v-label>
          </v-col>
          <v-col>
            <v-select
              v-model="paymentData.receiverId"
              :items="addressList"
              variant="outlined"
              hide-details
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
              :items="bookbankList"
              variant="outlined"
              hide-details
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
              variant="outlined"
              type="number"
              hide-details
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
            {{ paymentData.payDate }}
            <v-text-field
              v-model="paymentData.payDate"
              variant="outlined"
              type="datetime-local"
              hide-details
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
              variant="outlined"
              accept="image/*"
              label="File input"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <v-btn block color="primary">
              แจ้งชำระเงิน
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped>
</style>
