<script setup lang="ts">
import type { wareHouse } from '@/types/wareHouse/index'
import type { localCarrier } from '@/types/localCarrier/index'
import type { tracking } from '@/types/tracking/index'
definePageMeta({
  layout: 'guest',
  middleware: 'checkauth'
})
// const { data } = useSession()
const config = useRuntimeConfig()
const router = useRouter()

const formRegisterTracking = ref()
const editedItem: tracking = reactive({
  userId: 1, // data.value?.user?.id,
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

const itemsWareHouse: wareHouse[] = reactive([])
const itemsLocalCarrier: localCarrier[] = reactive([])

watch(() => editedItem.carrier, (carrier) => {
  fetchListWareHouse(carrier as string)
})

const fetchListWareHouse = async (carrier: string) => {
  const { data: listWarehouse } = await useFetch('/api/warehouse', {
    baseURL: config.public.apiBase,
    method: 'GET',
    params: { carrier }
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

  const { error } = await useFetch('/api/trackings', {
    baseURL: config.public.apiBase,
    method: 'post',
    body: {
      ...editedItem
    },
    onResponseError ({ response }) {
      if (response.status === 401) {
        router.push({ path: '/login' })
      }
    }
  })

  if (error.value) {
    snackbar.text = 'Save data failed'
    snackbar.color = 'error'
  } else {
    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
    formRegisterTracking.value.reset()
  }
  snackbar.status = true
}

// on mounted
const { data: listItems } = await useFetch('/api/localcarriers', {
  baseURL: config.public.apiBase,
  method: 'GET'
})
Object.assign(itemsLocalCarrier, listItems.value)
fetchListWareHouse(editedItem.carrier || 'Air')

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
            Website
          </v-label>
        </v-col>
        <v-col>
          <v-text-field
            v-model="editedItem.website"
            :rules="[(v) => !!v || 'Website is required']"
            variant="outlined"
            hide-details="auto"
            color="primary"
          />
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="3">
          <v-label class="font-weight-bold mb-1">
            Description
          </v-label>
        </v-col>
        <v-col cols="6">
          <v-textarea
            v-model="editedItem.description"
            hide-details="auto"
            variant="outlined"
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
            Warehouse
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
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" size="large" block @click="save">
            Register Tracking
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

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
