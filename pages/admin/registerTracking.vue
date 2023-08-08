<script setup lang="ts">
import type { wareHouse } from '@/types/wareHouse/index'
import type { localCarrier } from '@/types/localCarrier/index'
import type { tracking } from '@/types/tracking/index'

import { useCustomFetch } from '@/composables/useCustomFetch'

const formRegisterTracking = ref()

const itemsWareHouse: wareHouse[] = reactive([])
const itemsLocalCarrier: localCarrier[] = reactive([])
const itemsUsers = reactive([])

const editedItem: tracking = reactive({
  userId: null,
  carrierId: null,
  wareHouseId: null,
  trackingNumber: '',
  website: '',
  description: '',
  carrier: 'Air',
  status: 'pending'
})

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const save = async () => {
  const { valid } = await formRegisterTracking.value.validate()

  if (!valid) {
    return
  }
  try {
    await useCustomFetch('/api/trackings', {
      method: 'post',
      body: {
        ...editedItem
      }
    })

    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
  } catch (error) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
  } finally {
    snackbar.status = true
    formRegisterTracking.value.reset()
  }
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

const { data: listWarehouse } = await useCustomFetch('/api/warehouse', {
  method: 'GET',
  query: { status: 'active' }
})

watch(listWarehouse, (val) => {
  itemsWareHouse.length = 0
  editedItem.wareHouseId = null
  Object.assign(itemsWareHouse, val)
})

const { data: listUsers } = await useCustomFetch('/api/users', {
  method: 'GET'
})
watch(listUsers, (val) => {
  itemsUsers.length = 0
  Object.assign(itemsUsers, val?.rows)
})
</script>

<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row>
            <v-col> Register Tracking </v-col>
          </v-row>
        </v-card-title>
        <v-form ref="formRegisterTracking">
          <v-row align="center">
            <v-col cols="12" sm="3">
              <v-label class="font-weight-bold mb-1">
                User
              </v-label>
            </v-col>
            <v-col cols="12" sm="4">
              <v-autocomplete
                ref="inputUser"
                v-model="editedItem.userId"
                :rules="[(v) => !!v || 'Member is required']"
                variant="outlined"
                :items="itemsUsers"
                density="compact"
                item-title="name"
                item-value="id"
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="12" sm="3">
              <v-label class="font-weight-bold mb-1">
                Local Carrier
              </v-label>
            </v-col>
            <v-col cols="12" sm="4">
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
            <v-col cols="12" sm="3">
              <v-label class="font-weight-bold mb-1">
                Traking Number #
              </v-label>
            </v-col>
            <v-col cols="12" sm="4">
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
            <v-col cols="12" sm="3">
              <v-label class="font-weight-bold mb-1">
                Website (ถ้ามี)
              </v-label>
            </v-col>
            <v-col cols="12" sm="4">
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
            <v-col cols="12" sm="3">
              <v-label class="font-weight-bold mb-1">
                Description (ถ้ามี)
              </v-label>
            </v-col>
            <v-col cols="12" sm="6">
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
            <v-col cols="12" sm="3">
              <v-label class="font-weight-bold mb-1">
                Carrier
              </v-label>
            </v-col>
            <v-col cols="12" sm="6">
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
            <v-col cols="12" sm="3">
              <v-label class="font-weight-bold mb-1">
                Warehouse (โกดังต้นทาง)
              </v-label>
            </v-col>
            <v-col cols="12" sm="4">
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
            <v-col cols="12" sm="9">
              <v-btn color="primary" size="large" block @click="save">
                Register Tracking
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-item>
    </v-card>

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
