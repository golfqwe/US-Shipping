<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import type { MyAddress } from '@/types/myAddress/index'
import { useUserStore } from '@/stores/user'
import { useCustomFetch } from '@/composables/useCustomFetch'

definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const dialog = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const formInput = ref()
const items: MyAddress[] = reactive([])

const defaultItem: MyAddress = reactive({
  contact: '',
  email: '',
  phone: '',
  address: '',
  createBy: {},
  status: true
})
const editedIndex = ref(-1)
const editedItem: MyAddress = reactive({
  contact: '',
  email: '',
  phone: '',
  address: '',
  createBy: {},
  status: true
})

const { data: listAddress, refresh } = await useCustomFetch('/api/myaddress', {
  method: 'GET',
  query: { createBy: userInfo?.value?.id }
})

watch(listAddress, (val) => {
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
    const { error } = await useCustomFetch('/api/myAddress/' + editedIndex.value, {
      method: 'put',
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
    const { error } = await useCustomFetch('/api/myAddress/', {
      method: 'post',
      body: {
        contact: editedItem.contact,
        email: editedItem.email,
        phone: editedItem.phone,
        address: editedItem.address,
        createBy: userInfo?.value?.id, // data.value?.user?.id,
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
  <v-sheet id="content" class="pa-6" color="white" rounded>
    <v-row justify="space-between">
      <v-col>
        <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
          ที่อยู่ของฉัน
        </h5>
        <h5 class="text-error">
          * สามารถกำหนดที่อยู่เริ่มต้นได้แค่ 1 ที่เท่านั้น
        </h5>
      </v-col>
      <v-col cols="auto">
        <v-btn color="info" @click="dialog = true">
          <v-icon start>
            mdi-plus
          </v-icon>Add
        </v-btn>
      </v-col>
    </v-row>

    <v-table class="month-table">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-bold">
            ::
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Contact
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            Address
          </th>
          <th class="text-subtitle-1 font-weight-bold">
            E-mail
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
        <tr v-for="(item, index) in items" :key="index" class="month-item">
          <td>
            <p class="text-15 font-weight-medium">
              {{ item.id }}
            </p>
          </td>
          <td>
            <div class="text-no-wrap">
              <h6 class="text-subtitle-1 font-weight-bold ">
                {{ item.contact }}
              </h6>
              <div class="text-13 mt-1 text-muted">
                {{ item.phone }}
              </div>
            </div>
          </td>
          <td>
            <h6 class="text-body-1 text-muted">
              {{ item.address }}
            </h6>
          </td>
          <td>
            <v-chip :class="'text-body-1 bg-muted'" color="white" size="small">
              {{ item.email }}
            </v-chip>
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

    <v-dialog v-model="dialog" persistent width="800">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex > -1 ? "แก้ไข" : "เพิ่ม" }}ที่อยู่ของฉัน</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formInput">
              <v-row>
                <v-col cols="12">
                  <v-label class="font-weight-bold mb-1">
                    Contact<span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.contact"
                    :rules="[(v: string) => !!v || 'Contact is required']"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    E-mail<span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.email"
                    :rules="[(v: string) => !!v || 'E-mail is required']"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Phone<span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.phone"
                    :rules="[(v: string) => !!v || 'Phone is required']"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12">
                  <v-label class="font-weight-bold mb-1">
                    Address<span class="text-red">*</span>
                  </v-label>
                  <v-textarea
                    v-model="editedItem.address"
                    :rules="[(v) => !!v || 'Address is required']"
                    hide-details
                    variant="outlined"
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
                    hide-details="auto"
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
  </v-sheet>
</template>

<style scoped></style>
