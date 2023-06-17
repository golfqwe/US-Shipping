<script setup lang="ts">
import { useCustomFetch } from '@/composables/useCustomFetch'
import type { user } from '@/types/user/index'
definePageMeta({
  middleware: 'checkauth'
})

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

const pageSize = ref(10)
const page = ref(1)
const totalCount = ref(0)
const items: user[] = reactive([])

const loading = ref(false)
const search = ref(null)

const showPassword = ref(false)
const dialog = ref(false)
const formInput = ref()
const editedIndex = ref(-1)
const defaultItem: user = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  role: '',
  status: true
})
const editedItem: user = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  role: '',
  status: true
})

watch(dialog, (val) => {
  val || close()
})

watch(page, () => {
  fetchData()
})
watch(pageSize, () => {
  page.value = 1
  fetchData()
})

const editItem = (item: any) => {
  editedIndex.value = item.id
  Object.assign(editedItem, { ...item, status: item.status === 'active', password: '' })
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
    const buffer = {
      name: editedItem.name,
      email: editedItem.email,
      phone: editedItem.phone,
      role: editedItem.role,
      status: editedItem.status ? 'active' : 'inactive'
    }
    if (editedItem.password) {
      buffer.password = editedItem.password
    }
    const { error } = await useCustomFetch('/api/users/' + editedIndex.value, {
      method: 'put',
      body: buffer
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
    const { error } = await useCustomFetch('/api/users/', {
      method: 'post',
      body: {
        name: editedItem.name,
        email: editedItem.email,
        password: editedItem.password,
        phone: editedItem.phone,
        role: editedItem.role,
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
  fetchData()
}

const fetchData = async () => {
  const { data: listItems } = await useCustomFetch('/api/users/', {
    method: 'GET',
    query: { page: page.value, pageSize: pageSize.value, search: search.value }
  })

  watch(listItems, (val) => {
    items.length = 0
    totalCount.value = Math.ceil(val?.count / pageSize.value)
    Object.assign(items, val?.rows)
  })
}

fetchData()

</script>

<template>
  <div>
    <v-card elevation="10" class="">
      <v-card-item class="pa-6">
        <v-card-title class="text-h5 pt-sm-2 pb-7">
          <v-row justify="space-between">
            <v-col> ข้อมูลผู้ใช้งาน </v-col>
            <v-col>
              <v-row justify="end">
                <v-col cols="8">
                  <v-text-field
                    v-model="search"
                    :loading="loading"
                    density="compact"
                    variant="solo"
                    label="Search ..."
                    append-inner-icon="mdi-magnify"
                    single-line
                    hide-details
                    @keypress.prevent.enter=" fetchData"
                    @click:append-inner=" fetchData"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn color="info" @click="dialog = true">
                    <v-icon start>
                      mdi-plus
                    </v-icon>Add
                  </v-btn>
                </v-col>
              </v-row>
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
                Full Name
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Email
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Role
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
                  {{ item.name }}
                </h6>
              </td>
              <td>
                <div class="">
                  <h6 class="text-subtitle-1 font-weight-bold">
                    {{ item.email }}
                  </h6>
                  <div class="text-13 mt-1 text-muted">
                    {{ item.phone }}
                  </div>
                </div>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.role }}
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

    <v-row justify="end" class="mt-2">
      <v-col cols="auto">
        <v-select
          v-model="pageSize"
          :items="[10, 25, 100, 250]"
          density="compact"
          variant="solo"
        />
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="page"
          :length="totalCount"
          :total-visible="7"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent width="800">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            editedIndex > -1 ? "แก้ไข" : "เพิ่ม"
          }}ข้อมูลผู้ใช้งาน</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formInput">
            <v-row class="">
              <v-col cols="12">
                <v-label class="font-weight-bold mb-1">
                  อีเมล์ (ใช้ล็อคอิน) *
                </v-label>
                <v-text-field
                  v-model="editedItem.email"
                  :rules="[ v => !!v || 'E-mail is required',
                            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',]"
                  variant="outlined"
                  type="email"
                  hide-details="auto"
                  color="primary"
                  density="compact"
                  persistent-hint
                  hint="กรุณากรอกอีเมล์จริงที่ตรวจสอบได้ เพื่อใช้ยืนยันการสมัครสมาชิก"
                />
              </v-col>
              <v-col cols="12">
                <v-label class="font-weight-bold mb-1">
                  รหัสผ่าน *
                </v-label>
                <v-text-field
                  v-model="editedItem.password"
                  :rules="[v => !!v ? ( v.length >= 8) || 'Password must be less than 8 characters' : true]"
                  variant="outlined"
                  hide-details="auto"
                  color="primary"
                  density="compact"
                  :type="showPassword ? 'text' : 'password'"
                >
                  <template #append-inner>
                    <v-icon v-if="showPassword" class="pt-1" small @click="showPassword = !showPassword">
                      mdi-eye
                    </v-icon>
                    <v-icon v-else small class="pt-1" @click="showPassword = !showPassword">
                      mdi-eye-off
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-label class="font-weight-bold mb-1">
                  ชื่อ - สกุล (English Only)
                </v-label>
                <v-text-field
                  v-model="editedItem.name"
                  variant="outlined"
                  hide-details="auto"
                  density="compact"
                  :rules="[(v) => !!v ? /^[a-zA-Z0-9 .!?-]+$/.test(v) || 'Full Name has Englist Only' : true]"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-label class="font-weight-bold mb-1">
                  เบอร์โทร
                </v-label>
                <v-text-field
                  v-model="editedItem.phone"
                  variant="outlined"
                  :rules="[(v) => !!v ? (v.length > 10) || 'Telephone must be less than 10 characters' : true]"
                  type="tel"
                  hide-details="auto"
                  density="compact"
                  color="primary"
                />
              </v-col>
              <v-col cols="4">
                <v-label class="font-weight-bold mb-1">
                  Role
                </v-label>
                <v-select
                  v-model="editedItem.role"
                  :items="['admin', 'user']"
                  color="success"
                  variant="outlined"
                  density="compact"
                  hide-details
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
        </v-card-text>
        <v-card-actions>
          <small class="text-red">*indicates required field</small>
          <v-spacer />
          <v-btn color="error" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="info" @click="save">
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

<style scoped>

</style>
