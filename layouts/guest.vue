
<script setup lang="ts">

const title = ref('Us-shipping ')
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk}`
      : 'Us-shipping '
  }
})

const config = useRuntimeConfig()
let userInfo = useUserStore()

if (process.client) {
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
}

const userName = useUserName() // Same as useState('color')
watch(userName, (val) => {
  userInfo.name = val
})
const menuMain = reactive([
  {
    text: 'ที่อยู่ของฉัน',
    icon: 'shop.png',
    link: '/myAddress'
  },
  {
    text: 'ที่อยู่โกดังสินค้า',
    icon: 'shop.png',
    link: '/warehouse'
  },
  {
    text: 'Register Tracking',
    icon: 'invoice.png',
    link: '/register-tracking'
  },
  {
    text: 'บิลค่าขนส่ง',
    icon: 'payment.png',
    link: '/trackings'
  }
  // {
  //   text: 'บิลค่าขนส่ง',
  //   icon: 'icon1.png',
  //   link: '/payment'
  // }
])

const menuSub = reactive([
  {
    text: 'รอบนำเข้าสินค้า',
    icon: 'package.png',
    link: '/nextDayService'
  },
  {
    text: 'บริการรับกดสั่งสินค้า ประมูลสินค้า',
    icon: 'package.png',
    link: '/auction'
  },
  {
    text: 'คำถามที่พบบ่อย สินค้าต้องห้าม',
    icon: 'faq.png',
    link: '/faq'
  },
  {
    text: 'ติดต่อเจ้าหน้าที่',
    icon: 'customerService.png',
    link: '/customService'
  }
])

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})

function useAsset (path: string): string {
  // @ts-expect-error: wrong type info
  return new URL(`${config.BASE_URL}` + path, import.meta.url)
}

const signOut = async () => {
  const { data } = await useFetch('/api/auth/signOut', {
    baseURL: config.public.apiBase,
    method: 'post'
  })

  if (!data.value) {
    // Do your custom error handling here
    snackbar.text = 'You have made a terrible mistake while entering your credentials'
    snackbar.color = 'error'

    snackbar.status = true
  } else {
    // No error, continue with the sign in, e.g., by following the returned redirect:
    localStorage.removeItem('userInfo')
    userName.value = ''
    return navigateTo('/login')
  }
}

</script>

<template>
  <ClientOnly>
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
              <div v-if="userInfo?.name">
                <v-menu
                  :close-on-content-click="false"
                >
                  <template #activator="{ props }">
                    <v-btn
                      variant="text"
                      color="primary"
                      v-bind="props"
                    >
                      {{ userInfo?.name || userName }}
                    </v-btn>
                  </template>
                  <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
                    <v-list class="py-0" lines="one" density="compact">
                      <v-list-item active-color="primary" link to="/admin">
                        <template #prepend>
                          <FolderIcon stroke-width="1.5" size="20" />
                        </template>
                        <v-list-item-title class="pl-4 text-body-1">
                          จัดการข้อมูล
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <div class="pt-4 pb-4 px-5 text-center">
                      <v-btn color="primary" variant="outlined" block @click="signOut()">
                        Logout
                      </v-btn>
                    </div>
                  </v-sheet>
                </v-menu>
              </div>
              <div v-else>
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
          <v-row v-if="userInfo?.name || userName" justify="center">
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
          <slot />
        </v-container>
      </v-main>
    </v-app>
    <v-snackbar
      v-model="snackbar.status"
      :timeout="2000"
      :color="snackbar.color"
      location="top right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </ClientOnly>
</template>

<style scoped>

</style>
