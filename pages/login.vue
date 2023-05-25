<script lang="ts" setup>
// import { signIn } from 'next-auth/react'
definePageMeta({
  layout: 'guest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})
const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const formLogin = ref()
const formData = reactive({
  email: '',
  password: ''
})
const { signIn, data } = useSession()

const mySignInHandler = async () => {
  const { valid } = await formLogin.value.validate()

  if (!valid) {
    return
  }
  const { error } = await signIn('credentials', { ...formData, redirect: false })

  if (error) {
    // Do your custom error handling here
    snackbar.text = 'You have made a terrible mistake while entering your credentials'
    snackbar.color = 'error'

    snackbar.status = true
  } else {
    console.log('🚀 ~ file: login.vue:47 ~ mySignInHandler ~ url:', data.value)
    // No error, continue with the sign in, e.g., by following the returned redirect:
    return navigateTo('/')
  }
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
                <v-checkbox color="primary" hide-details>
                  <template #label>
                    <span class="text-body-1"> Remeber this Device </span>
                  </template>
                </v-checkbox>
                <div class="ml-sm-auto">
                  <NuxtLink
                    to="/"
                    class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
                  >
                    Forgot Password ?
                  </NuxtLink>
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
