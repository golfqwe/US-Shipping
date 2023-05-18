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
              Name
            </v-label>
            <v-text-field variant="outlined" hide-details color="primary" />
          </v-col>
          <v-col cols="12">
            <v-label class="font-weight-bold mb-1">
              Email Address
            </v-label>
            <v-text-field variant="outlined" type="email" hide-details color="primary" />
          </v-col>
          <v-col cols="12">
            <v-label class="font-weight-bold mb-1">
              Password
            </v-label>
            <v-text-field variant="outlined" type="password" hide-details color="primary" />
          </v-col>
          <v-col cols="12">
            <v-btn to="/" color="primary" size="large" block flat>
              Sign up
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped></style>
