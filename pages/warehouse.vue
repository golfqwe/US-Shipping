<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCustomFetch } from '@/composables/useCustomFetch'
import { useUserStore } from '@/stores/user'
import type { wareHouse } from '@/types/wareHouse/index'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const items:wareHouse[] = reactive([])
const currentItem = ref(0)

const { data: listWarehouse } = await useCustomFetch('/api/warehouse/', {
  method: 'GET'
})

watch(listWarehouse, (val) => {
  items.length = 0
  Object.assign(items, val)
})

const copyText = (item) => {
  // Creating textarea element
  const textarea = document.createElement('textarea')
  // Settings its value to the thing you want to copy
  textarea.value = `
  ${item?.name}
  ${userInfo?.value?.name}
  ${item?.address}
  ${item?.city}
  ${item?.state}
  ${item?.zip}
  ${item?.phone}
  `

  // Appending the textarea to body
  document.body.appendChild(textarea)
  // Selecting its content
  textarea.focus()
  textarea.select()
  // Copying the selected content to clipboard
  document.execCommand('copy')
  // Removing the textarea
  document.body.removeChild(textarea)

  snackbar.text = 'copied'
  snackbar.color = 'success'
  snackbar.status = true
}
</script>

<template>
  <v-sheet id="content" class="pa-6" color="white" rounded>
    <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
      ที่อยู่โกดัง
    </h5>

    <v-row no-gutters>
      <v-tabs
        v-model="currentItem"
        color="primary"
      >
        <v-tab
          v-for="(it,ind) in items"
          :key="ind"
          :value="ind"
        >
          {{ it.country }}
        </v-tab>
      </v-tabs>
    </v-row>
    <v-container>
      <v-window v-model="currentItem" class="py-2">
        <v-window-item
          v-for="(it,ind) in items"
          :key="ind"
          :value="ind"
        >
          <v-list-subheader inset>
            “รหัสอ้างอิงของลูกค้า และ ที่อยู่โกดัง สำหรับนำไปใช้สั่งซื้อสินค้าส่งมาลงที่คลัง”
          </v-list-subheader>

          <v-row no-gutters align="end">
            <v-col cols="4" sm="4" md="2">
              <h4 class=" text-grey">
                Name :
              </h4>
            </v-col>
            <v-col>
              <h4 class=" font-weight-bold">
                {{ it?.name }}
              </h4>
            </v-col>
          </v-row>
          <v-row no-gutters align="end">
            <v-col cols="4" sm="4" md="2">
              <h4 class=" text-grey">
                Last Name :
              </h4>
            </v-col>
            <v-col>
              <h4 class=" font-weight-bold">
                {{ userInfo?.name }}
              </h4>
            </v-col>
          </v-row>
          <v-row no-gutters align="end">
            <v-col cols="4" sm="4" md="2">
              <h4 class=" text-grey">
                Address :
              </h4>
            </v-col>
            <v-col>
              <h4 class=" font-weight-bold">
                {{ it?.address }}
              </h4>
            </v-col>
          </v-row>
          <v-row no-gutters align="end">
            <v-col cols="4" sm="4" md="2">
              <h4 class=" text-grey">
                City :
              </h4>
            </v-col>
            <v-col>
              <h4 class=" font-weight-bold">
                {{ it?.city }}
              </h4>
            </v-col>
          </v-row>
          <v-row no-gutters align="end">
            <v-col cols="4" sm="4" md="2">
              <h4 class=" text-grey">
                State :
              </h4>
            </v-col>
            <v-col>
              <h4 class=" font-weight-bold">
                {{ it?.state }}
              </h4>
            </v-col>
          </v-row>
          <v-row no-gutters align="end">
            <v-col cols="4" sm="4" md="2">
              <h4 class=" text-grey">
                Zip :
              </h4>
            </v-col>
            <v-col>
              <h4 class=" font-weight-bold">
                {{ it?.zip }}
              </h4>
            </v-col>
          </v-row>
          <v-row no-gutters align="end">
            <v-col cols="4" sm="4" md="2">
              <h4 class=" text-grey">
                Tel :
              </h4>
            </v-col>
            <v-col>
              <h4 class=" font-weight-bold">
                {{ it?.phone }}
              </h4>
            </v-col>
          </v-row>

          <v-row no-gutters justify="center">
            <v-col cols="4">
              <v-btn block color="primary" @click="copyText(it)">
                คัดลอก
              </v-btn>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>

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

<style scoped></style>
