<script lang="ts" setup>
definePageMeta({
  layout: 'guest'
})
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <v-row justify="center">
      <v-col sm="6" md="6" lg="4">
        <v-row class="d-flex mb-3">
          <v-col cols="12">
            <v-label class="font-weight-bold mb-1">
              Username
            </v-label>
            <v-text-field variant="outlined" hide-details color="primary" />
          </v-col>
          <v-col cols="12">
            <v-label class="font-weight-bold mb-1">
              Password
            </v-label>
            <v-text-field variant="outlined" type="password" hide-details color="primary" />
          </v-col>
          <v-col cols="12" class="pt-0">
            <div class="d-flex flex-wrap align-center ml-n2">
              <v-checkbox color="primary" hide-details>
                <template #label>
                  <span class="text-body-1">
                    Remeber this Device
                  </span>
                </template>
              </v-checkbox>
              <div class="ml-sm-auto">
                <NuxtLink
                  to="/"
                  class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
                >
                  Forgot
                  Password ?
                </NuxtLink>
              </div>
            </div>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-btn to="/" color="primary" size="large" block flat>
              Sign in
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped></style>
