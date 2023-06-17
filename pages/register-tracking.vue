<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { wareHouse } from '@/types/wareHouse/index'
import type { localCarrier } from '@/types/localCarrier/index'
import type { tracking } from '@/types/tracking/index'

import { useUserStore } from '@/stores/user'
import { useCustomFetch } from '@/composables/useCustomFetch'

definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const formRegisterTracking = ref()
const formUpdateTracking = ref()
const editedItem: tracking = reactive({
  userId: userInfo?.value?.id, // data.value?.user?.id,
  carrierId: null,
  wareHouseId: null,
  trackingNumber: '',
  website: '',
  description: '',
  carrier: 'Air',
  status: 'pending'
})
const editedIndex = ref(-1)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const dialogDelete = ref(false)
const dialogEdit = ref(false)

const itemsWareHouse: wareHouse[] = reactive([])
const itemsLocalCarrier: localCarrier[] = reactive([])
const itemsTracking: tracking[] = reactive([])

const fetchListWareHouse = async () => {
  const { data: listWarehouse } = await useCustomFetch('/api/warehouse', {
    method: 'GET',
    query: { status: 'active' }
  })
  itemsWareHouse.splice(0)
  editedItem.wareHouseId = null
  Object.assign(itemsWareHouse, listWarehouse.value)
}
const save = async () => {
  const { valid } = await formRegisterTracking.value.validate()

  if (!valid) {
    return
  }

  const { error } = await useCustomFetch('/api/trackings', {
    method: 'post',
    body: {
      ...editedItem
    }
  })

  if (error.value) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
  } else {
    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
    formRegisterTracking.value.reset()
    refresh()
  }
  snackbar.status = true
}
const update = async () => {
  const { valid } = await formUpdateTracking.value.validate()

  if (!valid) {
    return
  }

  const { error } = await useCustomFetch(`/api/trackings/${editedIndex.value}`, {
    method: 'put',
    body: {
      ...editedItem
    }
  })

  if (error.value) {
    snackbar.text = 'Update data failed'
    snackbar.color = 'error'
  } else {
    snackbar.text = 'Update data successfully'
    snackbar.color = 'success'

    refresh()
  }
  dialogEdit.value = false
  snackbar.status = true
}

const editItem = (item: tracking) => {
  editedIndex.value = Number(item.id)
  Object.assign(editedItem, item)
  dialogEdit.value = true
}
const close = () => {
  dialogEdit.value = false
  nextTick(() => {
    formUpdateTracking.value.reset()
    // Object.assign(editedItem, {
    //   userId: userInfo?.value?.id, // data.value?.user?.id,
    //   carrierId: null,
    //   wareHouseId: null,
    //   trackingNumber: '',
    //   website: '',
    //   description: '',
    //   carrier: 'Air',
    //   status: 'pending'
    // })
    editedIndex.value = -1
  })
}

const deleteItem = (item: tracking) => {
  editedIndex.value = Number(item.id)
  // this.editedItem = Object.assign({}, item)
  dialogDelete.value = true
}

const deleteItemConfirm = async () => {
  const { error } = await useCustomFetch(`/api/trackings/${editedIndex.value}`, {
    method: 'delete'
  })

  if (error.value) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
  } else {
    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
    refresh()
    dialogDelete.value = false
  }
  snackbar.status = true
}

// on mounted
const { data: listItems } = await useCustomFetch('/api/localcarriers', {
  method: 'GET',
  query: { status: 'active' }
})

watch(listItems, (val) => {
  itemsLocalCarrier.length = 0
  Object.assign(itemsLocalCarrier, val)
})

fetchListWareHouse()

const { data: itemsTrack, refresh } = await useCustomFetch('/api/trackings', {
  method: 'GET',
  query: { userId: userInfo?.value.id }
})

watch(itemsTrack, (val) => {
  itemsTracking.length = 0
  Object.assign(itemsTracking, val?.rows)
})

</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <v-row justify="center">
      <v-col cols="11">
        <v-alert variant="outlined" type="warning" icon="mdi-alert" border>
          ลงทะเบียน REGISTER TRACKING
          ถ้าไม่ลงทะเบียนรูปสินค้าอาจจะไม่ขึ้นแสดงในระบบ
        </v-alert>
      </v-col>
    </v-row>
    <v-form ref="formRegisterTracking">
      <v-row align="center">
        <v-col cols="3">
          <v-label class="font-weight-bold mb-1">
            Local Carrier
          </v-label>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="editedItem.carrierId"
            :items="itemsLocalCarrier"
            :rules="[(v) => !!v || 'Local Carrier is required']"
            item-title="name"
            item-value="id"
            density="compact"
            variant="outlined"
            hide-details="auto"
            color="primary"
          />
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-label class="font-weight-bold mb-1">
            Traking Number #
          </v-label>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.trackingNumber"
            :rules="[(v) => !!v || 'Traking Number is required']"
            hide-details="auto"
            density="compact"
            variant="outlined"
            color="primary"
          />
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-label class="font-weight-bold mb-1">
            Website (ถ้ามี)
          </v-label>
        </v-col>
        <v-col>
          <v-text-field
            v-model="editedItem.website"
            variant="outlined"
            color="primary"
            density="compact"
            type="url"
            persistent-hint
            placeholder="www.ebay.com"
            hint="Example: www.ebay.com"
          />
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-label class="font-weight-bold mb-1">
            Description (ถ้ามี)
          </v-label>
        </v-col>
        <v-col cols="6">
          <v-textarea
            v-model="editedItem.description"
            hide-details="auto"
            variant="outlined"
            density="compact"
            placeholder="ข้อมูลของสินค้า (ถ้ามี)"
            auto-grow
            color="primary"
          />
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-label class="font-weight-bold mb-1">
            Carrier
          </v-label>
        </v-col>
        <v-col cols="6">
          <v-radio-group
            v-model="editedItem.carrier"
            inline
            :rules="[(v) => !!v || 'Carrier is required']"
          >
            <v-radio label="Air Freight" value="Air">
              <template #label>
                <div>
                  <v-icon start size="x-large" color="success">
                    mdi-airplane
                  </v-icon>
                  <span>Air Freight</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="Ocean">
              <template #label>
                <div>
                  <v-icon start size="x-large" color="blue">
                    mdi-sail-boat
                  </v-icon>
                  <span>Ocean Freight</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-label class="font-weight-bold mb-1">
            Warehouse (โกดังต้นทาง)
          </v-label>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="editedItem.wareHouseId"
            density="compact"
            :rules="[(v) => !!v || 'Warehouse is required']"
            :items="itemsWareHouse"
            item-title="country"
            item-value="id"
            variant="outlined"
            hide-details="auto"
            color="primary"
          />
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="9">
          <v-btn color="primary" size="large" block @click="save">
            Register Tracking
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col>
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">
                ::
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Add On
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Local Carrier
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Warehouse
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Tracking
              </th>

              <th class="text-subtitle-1 font-weight-bold text-center">
                Description
              </th>
              <th class="text-subtitle-1 font-weight-bold text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, id) in itemsTracking"
              :key="id"
              class="month-item"
            >
              <td>
                <p class="text-15 font-weight-medium">
                  {{ item?.id }}
                </p>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{
                    item?.createdAt
                      ? new Date(item?.createdAt).toLocaleString("th-TH")
                      : "-"
                  }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted text-center">
                  <v-icon
                    start
                    size="x-large"
                    :color="item?.carrier === 'Air' ? 'success' : 'blue'"
                  >
                    {{
                      item?.carrier === "Air"
                        ? "  mdi-airplane"
                        : "   mdi-sail-boat"
                    }}
                  </v-icon>
                  {{ item?.carrier }}
                </h6>
              </td>
              <td>
                {{ item?.wareHouseId }}
              </td>
              <td>
                <div class="">
                  <h6 class="text-subtitle-1 font-weight-bold">
                    {{ item?.trackingNumber }}
                  </h6>
                  <div class="text-13 mt-1 text-muted">
                    {{ item?.website }}
                  </div>
                </div>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item?.description }}
                </h6>
              </td>

              <td class="text-right">
                <v-btn
                  v-show="item?.status?.code === 'pending' || item?.status?.code === 'waiting'"
                  size="small"
                  rounded="lg"
                  color="info"
                  @click="editItem(item)"
                >
                  <v-icon start dark>
                    mdi-pencil
                  </v-icon> edit
                </v-btn>
                <v-btn
                  v-show="item?.status?.code === 'pending' || item?.status?.code === 'waiting'"
                  size="small"
                  rounded="lg"
                  color="error"
                  @click="deleteItem(item)"
                >
                  <v-icon start dark>
                    mdi-delete
                  </v-icon> delete
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialogDelete = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogEdit"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="formUpdateTracking">
              <v-row align="center">
                <v-col cols="3">
                  <v-label class="font-weight-bold mb-1">
                    Local Carrier
                  </v-label>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="editedItem.carrierId"
                    :items="itemsLocalCarrier"
                    :rules="[(v) => !!v || 'Local Carrier is required']"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    hide-details="auto"
                    color="primary"
                  />
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="3">
                  <v-label class="font-weight-bold mb-1">
                    Traking Number #
                  </v-label>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="editedItem.trackingNumber"
                    :rules="[(v) => !!v || 'Traking Number is required']"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                  />
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="3">
                  <v-label class="font-weight-bold mb-1">
                    Website (ถ้ามี)
                  </v-label>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="editedItem.website"
                    :rules="[(v) => !!v || 'Website is required']"
                    variant="outlined"
                    color="primary"
                    type="url"
                    persistent-hint
                    placeholder="www.ebay.com"
                    hint="Example: www.ebay.com"
                  />
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="3">
                  <v-label class="font-weight-bold mb-1">
                    Description (ถ้ามี)
                  </v-label>
                </v-col>
                <v-col cols="6">
                  <v-textarea
                    v-model="editedItem.description"
                    hide-details="auto"
                    variant="outlined"
                    placeholder="ข้อมูลของสินค้า (ถ้ามี)"
                    color="primary"
                  />
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="3">
                  <v-label class="font-weight-bold mb-1">
                    Carrier
                  </v-label>
                </v-col>
                <v-col cols="6">
                  <v-radio-group
                    v-model="editedItem.carrier"
                    inline
                    :rules="[(v) => !!v || 'Carrier is required']"
                  >
                    <v-radio label="Air Freight" value="Air">
                      <template #label>
                        <div>
                          <v-icon start size="x-large" color="success">
                            mdi-airplane
                          </v-icon>
                          <span>Air Freight</span>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio value="Ocean">
                      <template #label>
                        <div>
                          <v-icon start size="x-large" color="blue">
                            mdi-sail-boat
                          </v-icon>
                          <span>Ocean Freight</span>
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="3">
                  <v-label class="font-weight-bold mb-1">
                    Warehouse (โกดังต้นทาง)
                  </v-label>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="editedItem.wareHouseId"
                    :rules="[(v) => !!v || 'Warehouse is required']"
                    :items="itemsWareHouse"
                    item-title="country"
                    item-value="id"
                    variant="outlined"
                    hide-details="auto"
                    color="primary"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="update"
          >
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

<style scoped>
</style>
