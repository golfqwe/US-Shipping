<script setup lang="ts">
import { useDisplay } from 'vuetify'

definePageMeta({
  layout: 'guest'
})

const { smAndDown } = useDisplay()
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
      ดำเนินการชำระเงิน
    </h5>

    <v-row>
      <v-col sm="12" md="6">
        payment
      </v-col>
      <v-divider
        :vertical="!smAndDown"
      />
      <v-col sm="12" md="6">
        <v-row align="center">
          <v-col cols="3">
            <v-label class="font-weight-bold mb-1">
              Inovice No
            </v-label>
          </v-col>
          <v-col cols="">
            <v-text-field
              variant="outlined"
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3">
            <v-label class="font-weight-bold mb-1">
              ที่อยู่
            </v-label>
          </v-col>
          <v-col>
            <v-select
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              variant="outlined"
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3">
            <v-label class="font-weight-bold mb-1">
              ชำระเงินเข้าบัญชี
            </v-label>
          </v-col>
          <v-col>
            <v-select
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              variant="outlined"
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3">
            <v-label class="font-weight-bold mb-1">
              Amount Paid <span class="text-red">*</span>
            </v-label>
          </v-col>
          <v-col cols="4">
            <v-text-field
              variant="outlined"
              type="number"
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3">
            <v-label class="font-weight-bold mb-1">
              วันเวลาที่ชำระเงิน
            </v-label>
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              type="datetime-local"
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3">
            <v-label class="font-weight-bold mb-1">
              หลักฐานการโอนเงิน
            </v-label>
          </v-col>
          <v-col>
            <v-file-input
              variant="outlined"
              accept="image/*"
              label="File input"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <v-btn block color="primary">
              แจ้งชำระเงิน
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped>
</style>
