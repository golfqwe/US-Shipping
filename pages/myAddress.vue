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
            ::
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Name
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Phone
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Address
          </th>
          <th class="text-subtitle-1 font-weight-bold text-center">
            Active
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
          <td class="text-center">
            <v-icon size="large" color="success">
              mdi-check-bold
            </v-icon>
          </td>
          <td class="text-right">
            <v-btn size="small" rounded="lg" color="info">
              <v-icon start dark>
                mdi-pencil
              </v-icon> edit
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-sheet>
</template>

<style scoped></style>
