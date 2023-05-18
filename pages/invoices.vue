<script lang="ts" setup>
definePageMeta({
  layout: 'guest'
})
const listInvoices = reactive([
  { test: 'tst' }
])
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
            Ship <Input:datetime-local />
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Add On
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Receive Info
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Carrier
          </th>
          <th class="text-subtitle-1 font-weight-bold text-right">
            Packages
          </th>
          <th class="text-subtitle-1 font-weight-bold text-right">
            Invoice No
          </th>
          <th class="text-subtitle-1 font-weight-bold text-right">
            Amount
          </th>
          <th class="text-subtitle-1 font-weight-bold text-right">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in listInvoices" :key="index" class="month-item">
          <td>
            <p class="text-15 font-weight-medium">
              {{ item.test }}
            </p>
          </td>
          <td>
            <div class="">
              <h6 class="text-subtitle-1 font-weight-bold">
                {{ item.test }}
              </h6>
              <div class="text-13 mt-1 text-muted">
                {{ item.test }}
              </div>
            </div>
          </td>
          <td>
            <h6 class="text-body-1 text-muted">
              {{ item.test }}
            </h6>
          </td>
          <td>
            <v-chip :class="'text-body-1 bg-info' " color="white" size="small">
              {{
                item.test
              }}
            </v-chip>
          </td>
          <td>
            <h6 class="text-h6 text-right">
              {{ item.test }}
            </h6>
          </td>
          <td>
            <h6 class="text-h6 text-right">
              {{ item.test }}
            </h6>
          </td>
          <td>
            <h6 class="text-h6 text-right">
              {{ item.test }}
            </h6>
          </td>
          <td class="text-right">
            <v-btn size="small" rounded="lg" color="success">
              Pay now
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>

<style scoped></style>
