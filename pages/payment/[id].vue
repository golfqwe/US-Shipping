<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { invoiceItem } from '@/types/invoiceItem/index'
import { invoice } from '@/types/invoice/index'
const route = useRoute()

definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})

const { smAndDown } = useDisplay()
const invoiceItems: invoiceItem[] = reactive([])
const invoiceInfo: invoice = reactive({})

const { data: invoiceList } = await useFetch(`/api/invoices/${route.params.id}`, {
  method: 'GET'
})
Object.assign(invoiceItems, invoiceList.value.InvoiceItemsModels)
Object.assign(invoiceInfo, invoiceList.value)

const calculateTotal = (it : invoiceItem) => {
  return ((it.fee * (it.weight === 0 || !it.weight ? 1 : it.weight)) * it.quantity).toFixed(2)
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
              <th class="text-left w-50">
                Description
              </th>
              <th class="text-left">
                Quantity
              </th>
              <th class="text-left">
                Weight
              </th>
              <th class="text-left">
                Fee (Bath)
              </th>
              <th class="text-left">
                Total (Bath)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, inx) in invoiceItems"
              :key="inx"
            >
              <td>{{ item.description }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.weight }}</td>
              <td>{{ item.fee }}</td>
              <td>{{ calculateTotal(item) }}</td>
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
              v-model="invoiceInfo.id"
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
              v-model="invoiceInfo.receiverId"
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              variant="outlined"
              hide-details
              color="primary"
            />
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
              v-model="invoiceInfo.receiverId"
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              variant="outlined"
              hide-details
              color="primary"
            />
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
            <v-text-field
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
