<template>
  <v-app>
    <v-app-bar height="80" :elevation="0" color="white">
      <!-- <span>Vuetify &nbsp;</span>
        <span class="font-weight-light">MATERIAL DESIGN</span> -->
      <v-row align="center">
        <v-col class="pa-2 ">
          <div class="d-flex flex-row ">
            <div class="d-inline-flex align-center  mx-4">
              <img
                src="~/assets/images/logo.png"
                style="height: 65px; object-fit: contain"
              >
            </div>
            <div class="d-flex flex-column">
              <p class="text-left">
                บริการขนส่งสินค้าจากประเทศสหรัฐอเมริกากลับ
              </p>
              <p class="text-left">
                ประเทศไทยและประเทศลาว : บริการรวดเร็ว
              </p>
              <p class="text-left">
                ซื่อสัตย์ ราคาประหยัด ตรวจสอบออนไลน์ได้ 24 ชั่วโมง
              </p>
            </div>
          </div>
        </v-col>

        <v-col class="ma-2">
          <div class="d-flex flex-column text-right">
            <NuxtLink> เข้าสู่ระบบ | สมัครสมาชิก</NuxtLink>

            <p>
              ฝ่ายบริการลูกค้า : 088-888-8888
            </p>
            <p>
              LINE @ USAUKJPANTOTHAI
            </p>
          </div>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main class="mx-0 bg-grey-lighten-4">
      <div>
        <v-carousel hide-delimiter-background height="350">
          <v-carousel-item
            src="http://www.shopandshipus.com/images/banner/home_banner_thai_3.jpg"
            cover
          />

          <v-carousel-item
            src="http://www.shopandshipus.com/images/banner/home_banner_thai_2n.jpg"
            cover
          />
          <v-carousel-item
            src="https://ali-static-asset-internal.flashexpress.com/commonFile/1679657859-ccdb1c4d55a2425baeb63ad5c01bc1a2.jpg"
            cover
          />
        </v-carousel>
      </div>
      <v-container>
        <!-- <v-sheet rounded color="accent" height="60" /> -->
        <v-row justify="center">
          <v-col>
            <v-sheet class="" color="white" rounded border>
              <v-container>
                <v-row
                  justify="center"
                >
                  <div class="d-flex justify-center ">
                    <v-sheet
                      v-for="n in 3"
                      :key="n"
                      class="ma-2 pa-2"
                    >
                      <NuxtLink>
                        <div class="d-flex flex-column">
                          <img
                            src="~/assets/icons/icon1.png"
                            style="height: 55px; object-fit: contain"
                          >
                          นำเข้าพัสดุ
                        </div>
                      </NuxtLink>
                    </v-sheet>
                  </div>
                </v-row>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-sheet class="" color="white" rounded border>
              <v-container>
                <h5 class="text-h5 font-weight-bold mb-4 text-darkprimary">
                  ระบบบริการลูกค้า
                </h5>
                <v-row
                  justify="center"
                >
                  <div class="d-flex justify-center ">
                    <v-sheet
                      v-for="n in 3"
                      :key="n"
                      class="ma-2 pa-2"
                    >
                      <NuxtLink>
                        <div class="d-flex flex-column">
                          <img
                            src="~/assets/icons/icon1.png"
                            style="height: 55px; object-fit: contain"
                          >
                          นำเข้าพัสดุ
                        </div>
                      </NuxtLink>
                    </v-sheet>
                  </div>
                </v-row>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
