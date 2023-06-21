<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCustomFetch } from '@/composables/useCustomFetch'

const title = ref('Us-shipping ')
const { xs } = useDisplay()

useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk}`
      : 'Us-shipping '
  }
})

const router = useRouter()
const config = useRuntimeConfig()

// const userInfo = useUserStore()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { clearUserInfo } = userStore

const menuMain = reactive([

  {
    text: 'ค่านำเข้าสินค้า',
    icon: '1_1.png',
    link: '/freight'
  },
  {
    text: 'ที่อยู่โกดังสินค้า',
    icon: '1_2.png',
    link: '/warehouse'
  },
  {
    text: 'Register Tracking',
    icon: '1_3.png',
    link: '/register-tracking'
  },
  {
    text: 'เช็ครูปสินค้า',
    icon: '1_4.png',
    link: '/trackings'
  },
  {
    text: 'บิลค่าขนส่ง',
    icon: '1_5.png',
    link: '/payment'
  }
])

const menuSub = reactive([

  {
    text: 'ที่อยู่ของฉัน',
    icon: '2_2.png',
    link: '/myAddress'
  },
  {
    text: 'รอบนำเข้าสินค้า',
    icon: '2_1.png',
    link: '/nextDayService'
  },

  {
    text: 'บริการรับกดสั่งสินค้า ประมูลสินค้า',
    icon: '2_3.png',
    link: '/auction'
  },
  {
    text: 'คำถามที่พบบ่อย สินค้าต้องห้าม',
    icon: '2_4.png',
    link: '/faq'
  },
  {
    text: 'ติดต่อเจ้าหน้าที่',
    icon: '2_5.png',
    link: '/customService'
  }
])

const snackbar = reactive({
  status: false,
  text: '',
  color: 'success'
})
const imageLogo = ref('')
const contact = ref('')
const slidIndex = ref(0)
const banner = reactive([])

function useAsset (path: string): string {
  // @ts-expect-error: wrong type info
  return new URL(`${config.BASE_URL}` + path, import.meta.url)
}

const signOut = async () => {
  const { data } = await useCustomFetch('/api/auth/signOut', {
    method: 'post'
  })

  if (!data.value) {
    // Do your custom error handling here
    snackbar.text = 'You have made a terrible mistake while entering your credentials'
    snackbar.color = 'error'

    snackbar.status = true
  } else {
    // No error, continue with the sign in, e.g., by following the returned redirect:
    clearUserInfo()
    // return navigateTo('/login')
    router.push({ path: '/' })
  }
}

const { data: dataLogo } = await useCustomFetch('/api/utils/type/logo', {
  method: 'get'
})
watch(dataLogo, (val) => {
  imageLogo.value = ''
  imageLogo.value = val?.image
})

const { data: dataContact } = await useCustomFetch('/api/utils/type/contact', {
  method: 'get'
})
watch(dataContact, (val) => {
  contact.value = ''
  contact.value = val?.contact
})

const { data: dataBanner } = await useCustomFetch('/api/utils/', {
  method: 'get',
  query: { type: 'banner' }
})
watch(dataBanner, (val) => {
  banner.length = 0
  banner.push(...val.map(it => it.image))
})

</script>

<template>
  <ClientOnly>
    <v-app>
      <v-app-bar :height="xs ? 140 : 90" :elevation="0" color="white">
        <!-- <span>Vuetify &nbsp;</span>
        <span class="font-weight-light">MATERIAL DESIGN</span> -->
        <v-row align="center" no-gutters justify="space-between">
          <v-col xs="12" sm="6" md="3" class="pa-2  ">
            <div class="d-flex flex-row justify-center">
              <div class="d-inline-flex align-center  mx-4">
                <v-img
                  :src="`${config.public.apiBase}${imageLogo}`"
                  :lazy-src="`${config.public.apiBase}${imageLogo}`"
                  width="230"
                  max-width="250"
                />
              </div>
              <div class="d-none d-sm-flex">
                <!-- <div class="d-flex flex-column ">
                  <p class="text-left">
                    บริการขนส่งสินค้าจากประเทศสหรัฐอเมริกากลับ
                  </p>
                  <p class="text-left">
                    ประเทศไทยและประเทศลาว : บริการรวดเร็ว
                  </p>
                  <p class="text-left">
                    ซื่อสัตย์ ราคาประหยัด ตรวจสอบออนไลน์ได้ 24 ชั่วโมง
                  </p>
                </div> -->
              </div>
            </div>
          </v-col>

          <v-col xs="12" sm="6" md="6" class="pa-2">
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
                      {{ userInfo?.name }}
                    </v-btn>
                  </template>
                  <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
                    <v-list v-show="userInfo?.role === 'admin'" class="py-0" lines="one" density="compact">
                      <v-list-item color="primary" link to="/admin">
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
              <div class="text-subtitle-1 text-right ">
                <!-- ฝ่ายบริการลูกค้า : 088-888-8888
                <br>
                LINE @ USAUKJPANTOTHAI -->
                <span v-html="contact" />
              </div>
            </div>
          </v-col>

          <!-- <v-col class=" hidden-md-and-up">
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
          </v-col> -->
        </v-row>
      </v-app-bar>

      <v-main class="mx-0 bg-grey-lighten-4">
        <div v-show="banner.length">
          <v-carousel v-model="slidIndex" hide-delimiter-background show-arrows="hover" cycle>
            <v-carousel-item
              v-for="(img,inx) in banner"
              :key="inx"
              :value="inx"
              :src="`${config.public.apiBase}${img}`"
              :lazy-src="`${config.public.apiBase}${img}`"
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
