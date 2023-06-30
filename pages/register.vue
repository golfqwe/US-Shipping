<script lang="ts" setup>
import type { user } from '@/types/user/index'
import { useCustomFetch } from '@/composables/useCustomFetch'

definePageMeta({
  layout: 'guest'
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const formRegister = ref()
const editedItem: user = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  status: true
})

const save = async () => {
  const { valid } = await formRegister.value.validate()

  if (!valid) {
    return
  }

  const { error } = await useCustomFetch('/api/auth/signUp', {
    method: 'post',
    body: {
      ...editedItem,
      status: editedItem.status ? 'active' : 'inactive'
    }
  })

  if (error.value) {
    snackbar.text = error.value.response?._data.message || 'Save data failed'
    snackbar.color = 'error'
  } else {
    snackbar.text = 'Save data successfully'
    snackbar.color = 'success'
    await navigateTo('/login')
  }
  snackbar.status = true
}
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <v-form ref="formRegister">
      <v-row justify="center">
        <v-col sm="6" md="6" lg="4">
          <h3
            class="text-h3 text-center font-weight-bold mb-4 text-darkprimary"
          >
            สมัครสมาชิก
          </h3>
          <v-row class="d-flex mb-3">
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
                :rules="[(v) => !!v || 'Password is required',
                         v => ( v.length >= 8) || 'Password must be less than 8 characters',]"
                variant="outlined"
                hide-details="auto"
                color="primary"
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
                ยืนยันรหัสผ่าน *
              </v-label>
              <v-text-field
                v-model="editedItem.confirmPassword"
                :rules="[(v) => !!v || 'Password is required',
                         v => ( v.length >= 8) || 'Password must be less than 8 characters',
                         v=> (v === editedItem.password) || 'Passwords do NOT match!']"
                variant="outlined"
                hide-details="auto"
                color="primary"
                :type="showConfirmPassword ? 'text' : 'password'"
              >
                <template #append-inner>
                  <v-icon v-if="showConfirmPassword" class="pt-1" small @click="showConfirmPassword = !showConfirmPassword">
                    mdi-eye
                  </v-icon>
                  <v-icon v-else small class="pt-1" @click="showConfirmPassword = !showConfirmPassword">
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
                :rules="[(v) => !!v ? (v.length >= 10) || 'Telephone must be less than 10 characters' : true]"
                type="tel"
                hide-details="auto"
                color="primary"
              />
            </v-col>

            <v-col cols="12">
              <v-btn
                color="primary"
                size="large"
                block
                flat
                @click="save"
              >
                Sign up
              </v-btn>
            </v-col>
          </v-row>
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

<style scoped></style>
