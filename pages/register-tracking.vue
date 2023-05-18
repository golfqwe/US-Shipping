<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})
</script>

<template>
  <v-sheet class="pa-6" color="white" rounded>
    <v-row justify="center">
      <v-col cols="11">
        <v-alert variant="outlined" type="warning" icon="mdi-alert" border>
          ลงทะเบียน REGISTER TRACKING
          ถ้าไม่ลงทะเบียนรูปสินค้าอาจจะไม่ขึ้นแสดงในระบบ
        </v-alert>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="3">
        <v-label class="font-weight-bold mb-1">
          Local Carrier
        </v-label>
      </v-col>
      <v-col cols="4">
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
          Traking Number #
        </v-label>
      </v-col>
      <v-col cols="4">
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
          Website
        </v-label>
      </v-col>
      <v-col>
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
          Description
        </v-label>
      </v-col>
      <v-col cols="6">
        <v-textarea hide-details variant="outlined" color="primary" />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="3">
        <v-label class="font-weight-bold mb-1">
          Carrier
        </v-label>
      </v-col>
      <v-col cols="6">
        <v-radio-group
          inline
        >
          <v-radio
            label="Air Freight"
            value="Air"
          >
            <template #label>
              <div>
                <v-icon start size="x-large" color="success">
                  mdi-airplane
                </v-icon>
                <span>Air Freight</span>
              </div>
            </template>
          </v-radio>
          <v-radio
            value="Ocean"
          >
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
    </v-row>
    <v-row align="center">
      <v-col cols="3">
        <v-label class="font-weight-bold mb-1">
          Warehouse
        </v-label>
      </v-col>
      <v-col cols="4">
        <v-select
          :items="['USPS', 'UPS', 'FedEx', 'DHL', 'Drop', 'On Trac', 'TNT', 'Amazon','GLS','Other']"
          variant="outlined"
          hide-details
          color="primary"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn to="/" color="primary" size="large" block flat>
          Register Tracking
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped>
</style>
