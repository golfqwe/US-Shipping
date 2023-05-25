<script setup lang="ts">
definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})
const items = reactive([
  {
    description: 'Net Wegiht',
    quantity: 1,
    weight: 0.85,
    fee: 1
  }
])
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
      บิลค่าขนส่ง {{ $route.params.id }}
    </h5>

    <v-row>
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
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
              v-for="item in items"
              :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.calories }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <!-- <v-row no-gutters>
      <v-col>
        <v-container>
          <div class="">
            <h6 class="text-subtitle-1 font-weight-bold">
              111
            </h6>
            <div class="text-13 mt-1 text-muted">
              111
            </div>
          </div>
        </v-container>
        <v-divider />
      </v-col>
      <v-divider
        class="mx-3"
        inset
        vertical
      />
      <v-col cols="4">
        <h5 class="text-h4 font-weight-bold mb-4 text-darkprimary">
          สรุปรายการ
        </h5>

        <v-row justify="space-between">
          <v-col cols="6">
            ยอดรวม (่จำนวน 1 ออเดอร์)
          </v-col>
          <v-col cols="auto" class="text-end">
            ฿ 100.00
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="6">
            ค่าขนส่ง
          </v-col>
          <v-col cols="auto" class="text-end">
            ฿ 100.00
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <v-row justify="space-between" class="font-weight-bold">
          <v-col cols="6">
            ยอดรวมทั้งสิ้น
          </v-col>
          <v-col cols="auto" class="text-end">
            ฿ 100.00
          </v-col>
        </v-row>
        <v-row justify="space-between" class="font-weight-bold">
          <v-col>
            <v-btn block color="primary" to="paymentDetail">
              ดำเนินการชำระเงิน
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
  </v-sheet>
</template>

<style scoped>
</style>
