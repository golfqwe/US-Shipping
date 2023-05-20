<script setup lang="ts">
const dialog = ref(false)
const search = ref(null)
const loading = ref(false)
const formWarehouse = ref()
const itemsCountry = reactive([])
const items = reactive([
  {
    id: 1,
    country: 'test',
    carrier: 'Air',
    address: 1,
    status: 1
  }
])

const defaultItem = reactive({
  country: '',
  carrier: 'Air',
  address: '',
  status: 1
})
const editedIndex = ref(-1)
const editedItem = reactive({
  country: '',
  carrier: '',
  address: '',
  status: 1
})

watch(search, (val) => {
  val && val !== editedItem.country && querySelections(val)
})
watch(dialog, (val) => {
  val || close()
})

const querySelections = async (v: string) => {
  loading.value = true
  // Simulated ajax query
  const { data: countries } = await useLazyFetch(
    `https://restcountries.com/v3.1/name/${v}`,
    {
      transform: cty => cty
    }
  )
  Object.assign(itemsCountry, toRaw(countries.value))
  loading.value = false
}

const editItem = (item: any) => {
  editedIndex.value = item.id
  Object.assign(editedItem, item)
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

  if (!valid) { return }
  if (editedIndex.value > -1) {
    await useFetch('/api/auth/login', {
      onResponse ({ request, response, options }) {
        // Process the response data
        localStorage.setItem('token', response._data.token)
      },
      onResponseError ({ request, response, options }) {
        // Handle the response errors
      }
    })
  } else {
    // this.desserts.push(this.editedItem)
  }
  close()
}

</script>
<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col> Recent Transactions </v-col>
            <v-col cols="auto">
              <v-btn color="info" @click="dialog = true">
                <v-icon start>
                  mdi-plus
                </v-icon>เพิ่ม
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
                Carrier
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
                  {{ item.carrier }}
                </h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted">
                  {{ item.address }}
                </h6>
              </td>
              <td>
                <h6 class="text-h6 ">
                  {{ item.status }}
                </h6>
              </td>
              <td class="text-center">
                <v-chip
                  class="text-body-1 bg-success"
                  color="white"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </td>
              <td class="text-right">
                <v-btn size="small" rounded="lg" color="info" @click="editItem(item)">
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
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formWarehouse">
              <v-row>
                <v-col cols="12">
                  <v-label class="font-weight-bold mb-1">
                    Country <span class="text-red">*</span>
                  </v-label>
                  <v-autocomplete
                    v-model="editedItem.country"
                    v-model:search="search"
                    :loading="loading"
                    :rules="[(v) => !!v || 'Country is required']"
                    :items="itemsCountry"
                    density="comfortable"
                    hide-no-data
                    item-title="name.common"
                    item-value="name.common"
                    color="primary"
                    hide-details="auto"
                    clearable
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-label class="font-weight-bold mb-1">
                    Carrier<span class="text-red">*</span>
                  </v-label>
                  <v-radio-group
                    v-model="editedItem.carrier"
                    inline
                    hide-details="auto"
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
  </div>
</template>
