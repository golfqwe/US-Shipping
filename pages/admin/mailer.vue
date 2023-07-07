<script setup lang="ts">
import type { mailer } from '@/types/mailer/index'
import { useCustomFetch } from '@/composables/useCustomFetch'

definePageMeta({
  middleware: 'checkauth'
})

const dialog = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const formInput = ref()
const showPassword = ref()
const items: mailer[] = reactive([])

const loading = ref(false)
const mailChack = ref(false)
const mailStatus = ref(false)
const editedIndex = ref(-1)
const defaultItem: mailer = reactive({
  email: '',
  password: '',
  type: '',
  status: true
})
const editedItem: mailer = reactive({
  email: '',
  password: '',
  type: '',
  status: true
})

const { data: listItems, refresh } = await useCustomFetch('/api/mailer/', {
  method: 'GET'
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
  mailChack.value = false
  mailStatus.value = false
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
    const { error } = await useCustomFetch('/api/mailer/' + editedIndex.value, {
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
    const { error } = await useCustomFetch('/api/mailer/', {
      method: 'post',
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
  }
  close()
  refresh()
}
const verify = async () => {
  loading.value = true

  try {
    const { data } = await useCustomFetch('/api/mailer/verify/', {
      method: 'post',
      body: {
        type: editedItem.type,
        email: editedItem.email,
        password: editedItem.password
      }
    })
    console.log('data.value :>> ', data.value)
    if (data.value) {
      mailStatus.value = true
    } else {
      mailStatus.value = false
    }
    mailChack.value = true
  } catch (error) {
    console.log('🚀 ~ file: mailer.vue:114 ~ verify ~ error:', error)
    mailChack.value = true
    mailStatus.value = false
  } finally {
    loading.value = false
  }
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
                Email
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Password
              </th>
              <th class="text-subtitle-1 font-weight-bold">
                Type
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
                  {{ item.email }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.password?.replaceAll(/\w/ig,'*') }}
                </h6>
              </td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">
                  {{ item.type }}
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
                  <v-btn
                    :loading="loading"
                    height="48"
                    variant="tonal"
                    color="warning"
                    @click="verify"
                  >
                    ตรวจสอบ Email
                  </v-btn>
                  <v-chip
                    v-show="mailChack"
                    class="ma-2"
                    :color="mailStatus ? 'success' : 'error'"
                    text-color="white"
                    :prepend-icon="mailStatus ? 'mdi-checkbox-marked-circle' : 'mdi-close'"
                  >
                    {{ mailStatus ? 'ใช้งานได้' : 'ไม่สามารถใช้งานได้' }}
                  </v-chip>
                </v-col>
                <v-col cols="6">
                  <v-label class="font-weight-bold mb-1">
                    Type<span class="text-red">*</span>
                  </v-label>
                  <v-select
                    v-model="editedItem.type"
                    :rules="[(v: string) => !!v || 'Account Type is required']"
                    hide-details
                    variant="outlined"
                    density="compact"
                    :items="['hotmail','gmail']"
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
