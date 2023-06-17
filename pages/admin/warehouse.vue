<script setup lang="ts">
import { useCustomFetch } from '@/composables/useCustomFetch'
import type { wareHouse } from '@/types/wareHouse/index'

definePageMeta({
  middleware: 'checkauth'
})

const dialog = ref(false)
const formWarehouse = ref()
const items: wareHouse[] = reactive([])

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const defaultItem: wareHouse = reactive({
  country: '',
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  status: true
})
const editedIndex = ref(-1)
const editedItem: wareHouse = reactive({
  country: '',
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  status: true
})

const { data: listWarehouse, refresh } = await useCustomFetch('/api/warehouse/', {
  method: 'GET'
})

watch(listWarehouse, (val) => {
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
  const { valid } = await formWarehouse.value.validate()

  if (!valid) {
    return
  }
  if (editedIndex.value > -1) {
    const { error } = await useCustomFetch('/api/warehouse/' + editedIndex.value, {
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
    const { error } = await useCustomFetch('/api/warehouse/', {
      method: 'post',
      body: {
        country: editedItem.country,
        name: editedItem.name,
        address: editedItem.address,
        city: editedItem.city,
        state: editedItem.state,
        zip: editedItem.zip,
        phone: editedItem.phone,
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
            <v-col> ที่อยู่โกดัง </v-col>
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
                Country
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Name
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Address
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
                  {{ item.country }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted">
                  {{ item.name }}
                </h6>
              </td>
              <td>
                <div class="">
                  <h6 class="text-subtitle-1 font-weight-bold">
                    {{ item?.address }}
                  </h6>
                  <div class="text-13 mt-1 text-muted">
                    {{ item?.city }} {{ item?.state }} {{ item?.zip }}
                  </div>
                  <div class="text-13 mt-1 ">
                    {{ item?.phone }}
                  </div>
                </div>
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
          <span class="text-h5">{{ editedIndex > -1 ? "แก้ไข" : "เพิ่ม" }}ที่อยู่โกดัง</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formWarehouse">
              <v-row>
                <v-col cols="12">
                  <v-label class="font-weight-bold mb-1">
                    Country <span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.country"
                    :rules="[(v) => !!v || 'country is required']"
                    hide-details="auto"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </v-col>
                <v-col cols="12">
                  <v-label class="font-weight-bold mb-1">
                    Name <span class="text-red">*</span>
                  </v-label>
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="[(v) => !!v || 'Name is required']"
                    hide-details="auto"
                    variant="outlined"
                    density="compact"
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
                    auto-grow
                    density="compact"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    City
                  </v-label>
                  <v-text-field
                    v-model="editedItem.city"
                    hide-details="auto"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    State
                  </v-label>
                  <v-text-field
                    v-model="editedItem.state"
                    hide-details="auto"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Zip
                  </v-label>
                  <v-text-field
                    v-model="editedItem.zip"
                    hide-details="auto"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Telephone
                  </v-label>
                  <v-text-field
                    v-model="editedItem.phone"
                    hide-details="auto"
                    variant="outlined"
                    density="compact"
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
