
<script setup lang="ts">
const menuMain = reactive([
  {
    text: 'ค่านำเข้าสินค้า',
    icon: 'icon1.png',
    link: '/'
  },
  {
    text: 'ที่อยู่โกดังสินค้า',
    icon: 'icon1.png',
    link: '/warehouse'
  },
  {
    text: 'Register Tracking',
    icon: 'icon1.png',
    link: '/register-tracking'
  },
  {
    text: 'เช็ครูปสินค้า',
    icon: 'icon1.png',
    link: '/trackings'
  },
  {
    text: 'บิลค่าขนส่ง',
    icon: 'icon1.png',
    link: '/payment'
  }
])

const menuSub = reactive([
  {
    text: 'รอบนำเข้าสินค้า',
    icon: 'icon1.png',
    link: '/'
  },
  {
    text: 'ที่อยู่ของฉัน',
    icon: 'icon1.png',
    link: '/myAddress'
  },
  {
    text: 'บริการรับกดสั่งสินค้า ประมูลสินค้า',
    icon: 'icon1.png',
    link: '/'
  },
  {
    text: 'คำถามที่พบบ่อย สินค้าต้องห้าม',
    icon: 'icon1.png',
    link: '/'
  },
  {
    text: 'ติดต่อเจ้าหน้าที่',
    icon: 'icon1.png',
    link: '/'
  }
])

const config = useRuntimeConfig()

function useAsset (path: string): string {
  // @ts-expect-error: wrong type info
  return new URL(`${config.BASE_URL}` + path, import.meta.url)
}

</script>

<template>
  <v-app>
    <v-app-bar height="90" :elevation="0" color="white">
      <!-- <span>Vuetify &nbsp;</span>
        <span class="font-weight-light">MATERIAL DESIGN</span> -->
      <v-row align="center" no-gutters>
        <v-col class="pa-2  hidden-sm-and-down">
          <div class="d-flex flex-row ">
            <div class="d-inline-flex align-center  mx-4">
              <img
                src="/images/main/logo.png"
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

        <v-col cols="auto" class="ma-2 hidden-sm-and-down">
          <div class="d-flex flex-column text-right">
            <div>
              <NuxtLink to="login" class="text-decoration-none text-darkprimary font-weight-bold">
                เข้าสู่ระบบ
              </NuxtLink>|<NuxtLink to="register" class="text-decoration-none text-darkprimary font-weight-bold">
                สมัครสมาชิก
              </NuxtLink>
            </div>
            <p>
              ฝ่ายบริการลูกค้า : 088-888-8888
            </p>
            <p>
              LINE @ USAUKJPANTOTHAI
            </p>
          </div>
        </v-col>

        <v-col class=" hidden-md-and-up">
          <v-row no-gutters justify="center" align="center">
            <v-sheet
              class="d-flex flex-column  align-center "
            >
              <div class="d-inline-flex align-center  mx-4">
                <img
                  src="/images/main/logo.png"
                  style="height: 65px; object-fit: contain"
                >
              </div>
              <div>
                <NuxtLink to="login" class="text-decoration-none text-darkprimary font-weight-bold">
                  เข้าสู่ระบบ
                </NuxtLink>|<NuxtLink to="register" class="text-decoration-none text-darkprimary font-weight-bold">
                  สมัครสมาชิก
                </NuxtLink>
              </div>
            </v-sheet>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main class="mx-0 bg-grey-lighten-4">
      <div>
        <v-carousel hide-delimiter-background height="350">
          <v-carousel-item
            src="https://ali-static-asset-internal.flashexpress.com/commonFile/1679657859-ccdb1c4d55a2425baeb63ad5c01bc1a2.jpg"
            cover
          />
          <v-carousel-item
            src="http://www.shopandshipus.com/images/banner/home_banner_thai_3.jpg"
            cover
          />

          <v-carousel-item
            src="http://www.shopandshipus.com/images/banner/home_banner_thai_2n.jpg"
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
                  <div
                    v-for="(it, id) in menuMain"
                    :key="id"
                    class="d-flex pa-2 justify-center"
                    style="min-width: 50px; max-width: 150px;"
                  >
                    <NuxtLink :to="it.link" class="text-decoration-none text-darkprimary">
                      <div class="d-flex flex-column">
                        <img
                          :src="useAsset(`images/icons/${it.icon}`)"
                          style="height: 50px; object-fit: contain"
                        >
                        <span class="pt-2 text-center font-weight-bold">{{ it.text }}</span>
                      </div>
                    </NuxtLink>
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
                  <div
                    v-for="(it, id) in menuSub"
                    :key="id"
                    class="d-flex pa-2 justify-center"
                    style="min-width: 50px; max-width: 150px;"
                  >
                    <NuxtLink :to="it.link" class="text-decoration-none text-darkprimary">
                      <div class="d-flex flex-column">
                        <img
                          :src="useAsset(`images/icons/${it.icon}`)"
                          style="height: 50px; object-fit: contain"
                        >
                        <span class="pt-2 text-center font-weight-bold">{{ it.text }}</span>
                      </div>
                    </NuxtLink>
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

<style scoped>

</style>
