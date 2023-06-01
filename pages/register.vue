<script lang="ts" setup>
import type { user } from '@/types/user/index'
const config = useRuntimeConfig()

definePageMeta({
  layout: 'guest'
})

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
  role: 'user',
  status: true
})

const save = async () => {
  const { valid } = await formRegister.value.validate()

  if (!valid) {
    return
  }

  const { error } = await useFetch('/api/auth/signUp', {
    baseURL: config.public.apiBase,
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
                Name
              </v-label>
              <v-text-field
                v-model="editedItem.name"
                variant="outlined"
                hide-details="auto"
                :rules="[(v) => !!v || 'Name is required']"
                color="primary"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="font-weight-bold mb-1">
                Telephone
              </v-label>
              <v-text-field
                v-model="editedItem.phone"
                variant="outlined"
                :rules="[(v) => !!v || 'Telephone is required',
                         v => (v.length > 10) || 'Telephone must be less than 10 characters']"
                type="tel"
                hide-details="auto"
                color="primary"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="font-weight-bold mb-1">
                Email Address
              </v-label>
              <v-text-field
                v-model="editedItem.email"
                :rules="[ v => !!v || 'E-mail is required',
                          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',]"
                variant="outlined"
                type="email"
                hide-details="auto"
                color="primary"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="font-weight-bold mb-1">
                Password
              </v-label>
              <v-text-field
                v-model="editedItem.password"
                :rules="[(v) => !!v || 'Password is required',
                         v => ( v.length >= 8) || 'Password must be less than 8 characters',]"
                variant="outlined"
                type="password"
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
