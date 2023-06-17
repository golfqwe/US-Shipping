<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const config = useRuntimeConfig()

definePageMeta({
  layout: 'guest'
})

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const router = useRouter()

const formLogin = ref()
const rmCheck = ref(false)
const formData = reactive({
  email: '',
  password: ''
})

const mySignInHandler = async () => {
  const { valid } = await formLogin.value.validate()

  if (!valid) {
    return
  }
  rememberMe()
  // const { error } = await signIn('credentials', { ...formData, redirect: false })

  const { data } = await useFetch('/api/auth/signIn', {
    baseURL: config.public.apiBase,
    method: 'post',
    body: {
      ...formData
    }
  })

  if (!data.value) {
    // Do your custom error handling here
    snackbar.text = 'You have made a terrible mistake while entering your credentials'
    snackbar.color = 'error'

    snackbar.status = true
  } else {
    // if (process.client) {
    //   localStorage.setItem('userInfo', JSON.stringify(data?.value?.data))
    // }
    userStore.setUserInfo(data?.value?.data)
    // No error, continue with the sign in, e.g., by following the returned redirect:

    // return navigateTo('/')
    router.push({ path: '/' })
  }
}
const rememberMe = () => {
  if (rmCheck.value) {
    localStorage.setItem('email', formData.email)
    localStorage.setItem('password', formData.password)
  } else {
    localStorage.removeItem('email')
    localStorage.removeItem('password')
  }
}

if (localStorage.getItem('email')) {
  rmCheck.value = true
  formData.email = localStorage.getItem('email') as string
  formData.password = localStorage.getItem('password') as string
}

</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <v-form ref="formLogin">
      <v-row justify="center">
        <v-col sm="6" md="6" lg="4">
          <h3
            class="text-h3 text-center font-weight-bold mb-4 text-darkprimary"
          >
            เข้าสู่ระบบ
          </h3>
          <v-row class="d-flex mb-3">
            <v-col cols="12">
              <v-label class="font-weight-bold mb-1">
                Email
              </v-label>
              <v-text-field
                v-model="formData.email"
                :rules="[
                  (v) => !!v || 'E-mail is required',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ]"
                variant="outlined"
                hide-details="auto"
                color="primary"
              />
            </v-col>
            <v-col cols="12">
              <v-label class="font-weight-bold mb-1">
                Password
              </v-label>
              <v-text-field
                v-model="formData.password"
                :rules="[
                  (v) => !!v || 'Password is required',
                  (v) =>
                    v.length >= 8 || 'Password must be less than 8 characters',
                ]"
                variant="outlined"
                type="password"
                hide-details="auto"
                color="primary"
              />
            </v-col>
            <v-col cols="12" class="pt-0">
              <div class="d-flex flex-wrap align-center ml-n2">
                <v-checkbox v-model="rmCheck" color="primary" hide-details>
                  <template #label>
                    <span class="text-body-1"> Remeber this Device </span>
                  </template>
                </v-checkbox>
                <div class="ml-sm-auto">
                  <!-- <NuxtLink
                    to="/"
                    class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
                  >
                    Forgot Password ?
                  </NuxtLink> -->
                </div>
              </div>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-btn color="primary" size="large" block flat @click="mySignInHandler">
                Sign in
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
