<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { BookBank } from '@/types/bookbank/index'
definePageMeta({
  middleware: 'checkauth'
})

const config = useRuntimeConfig()
const router = useRouter()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const dialog = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const formInput = ref()
const items: BookBank[] = reactive([])

const editedIndex = ref(-1)
const defaultItem: BookBank = reactive({
  accountName: '',
  bankName: '',
  branch: '',
  accountType: '',
  accountNumber: '',
  status: true
})
const editedItem: BookBank = reactive({
  accountName: '',
  bankName: '',
  branch: '',
  accountType: '',
  accountNumber: '',
  status: true
})

const { data: listItems, refresh } = await useLazyFetch('/api/bookBank/', {
  method: 'GET',
  baseURL: config.public.apiBase,
  headers: {
    authorization: 'Bearer ' + userInfo?.value?.token
  },
  onResponseError ({ response }) {
    if (response.status === 401) {
      router.push({ path: '/login' })
    }
  }
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
  Object.assign(editedItem, { ...item, status: item.status === 'active' })
  dialog.value = true
}
const close = async () => {
  dialog.value = false
  await nextTick(() => {
    Object.assign(editedItem, defaultItem)
    editedIndex.value = -1
  })
}
const save = async () => {
  const { valid } = await formInput.value.validate()

  if (!valid) {
    return
  }
  if (editedIndex.value > -1) {
    const { error } = await useFetch('/api/bookBank/' + editedIndex.value, {
      method: 'put',
      baseURL: config.public.apiBase,
      headers: {
        authorization: 'Bearer ' + userInfo?.value?.token
      },
      body: {
        ...editedItem,
        status: editedItem.status ? 'active' : 'inactive'
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
  } else {
    const { error } = await useFetch('/api/bookBank/', {
      method: 'post',
      baseURL: config.public.apiBase,
      headers: {
        authorization: 'Bearer ' + userInfo?.value?.token
      },
      body: {
        accountName: editedItem.accountName,
        bankName: editedItem.bankName,
        branch: editedItem.branch,
        accountType: editedItem.accountType,
        accountNumber: editedItem.accountNumber,
        status: editedItem.status ? 'active' : 'inactive'
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
  }
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
            <v-col> ข้อมูลบัญชีที่รับชำระ </v-col>
            <v-col cols="auto">
              <v-btn color="info" @click="dialog = true">
                <v-icon start>
                  mdi-plus
                </v-icon>Add
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">
                ::
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Account Name
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Bank Name
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Account Type
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Account Number
              </th>

              <th class="text-subtitle-1 font-weight-bold text-center">
                status
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
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.accountName }}
                </h6>
              </td>
              <td>
                <div class="">
                  <h6 class="text-subtitle-1 font-weight-bold">
                    {{ item.bankName }}
                  </h6>
                  <div class="text-13 mt-1 text-muted">
                    {{ item.branch }}
                  </div>
                </div>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.accountType }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.accountNumber }}
                </h6>
              </td>

              <td class="text-center">
                <v-chip
                  :class="{
                    'text-body-1': true,
                    'bg-success': item.status === 'active',
                    'bg-error': item.status === 'inactive',
                  }"
                  color="white"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </td>
              <td class="text-right">
                <v-btn
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-pencil
                  </v-icon> edit
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-dialog v-model="dialog" persistent width="800">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            editedIndex > -1 ? "แก้ไข" : "เพิ่ม"
          }}ข้อมูลบัญชีที่รับชำระ</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formInput">
              <v-row>
                <v-col cols="12">
                  <v-label class="font-weight-bold mb-1">
                    Account Name<span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.accountName"
                    :rules="[(v: string) => !!v || 'Account Name is required']"
                    hide-details
                    variant="outlined"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Bank Name<span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.bankName"
                    :rules="[(v: string) => !!v || ' Bank Name is required']"
                    hide-details
                    variant="outlined"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Branch<span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.branch"
                    :rules="[(v: string) => !!v || 'Branch is required']"
                    hide-details
                    variant="outlined"
                    color="primary"
                  />
                </v-col>

                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Account Number<span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.accountNumber"
                    :rules="[(v: string) => !!v || 'Account Number is required']"
                    hide-details
                    variant="outlined"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Account Type<span class="text-red">*</span>
                  </v-label>
                  <v-select
                    v-model="editedItem.accountType"
                    :rules="[(v: string) => !!v || 'Account Type is required']"
                    hide-details
                    variant="outlined"
                    :items="['ออมทรัพย์','ออมทรัพย์พิเศษ','ฝากประจำ']"
                    color="primary"
                  />
                </v-col>
                <v-col v-show="editedIndex > -1" cols="4">
                  <v-label class="font-weight-bold mb-1">
                    Status
                  </v-label>
                  <v-switch
                    v-model="editedItem.status"
                    color="success"
                    hide-details
                    inset
                    :label="`${editedItem.status ? 'active' : 'inactive'}`"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <small class="text-red">*indicates required field</small>
          <v-spacer />
          <v-btn color="error" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
            Save
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
