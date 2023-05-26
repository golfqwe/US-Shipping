<script setup lang="ts">
import type { tracking } from '@/types/tracking/index'
// import { invoiceItem } from '@/types/invoiceItem/index'
definePageMeta({
  middleware: 'checkauth'
})

const dialog = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const items: tracking[] = reactive([])

const editedIndex = ref(-1)

const { data: listItems, refresh } = await useLazyFetch('/api/trackings/', {
  method: 'GET',
  query: { status: 'paymented' }
})

watch(listItems, (val) => {
  items.length = 0
  Object.assign(items, val)
})

watch(dialog, (val) => {
  val || close()
})

const editItem = (item: any) => {
  editedIndex.value = item.id
  dialog.value = true
}
const close = async () => {
  dialog.value = false
  await nextTick(() => {
    editedIndex.value = -1
  })
}
const save = async () => {
  const { error } = await useFetch(`/api/trackings/${editedIndex.value}`, {
    method: 'put',
    body: {
      status: 'waiting'
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
                    new Date(item?.createdAt).toLocaleString("en-US", {
                      timeZone: "UTC",
                    })
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

    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card>
        <v-card-title>
          <span class="text-h5">ตรวจสอบสลิป</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="10"
            >
              <div class="ma-4">
                <v-img
                  class="bg-white"
                  width="450"
                  :aspect-ratio="1"
                  src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
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
          <v-btn color="blue-darken-1" variant="text" @click="save">
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
