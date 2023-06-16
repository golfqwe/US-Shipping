
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import VueTablerIcons from 'vue-tabler-icons'
import 'vuetify/styles'
import '@/scss/style.scss'
import {
  YellowTheme
} from '@/theme/LightTheme'
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'YellowTheme',
      themes: {
        YellowTheme
      }
    }
  })
  nuxtApp.vueApp.use(vuetify)
  nuxtApp.vueApp.use(PerfectScrollbar)
  nuxtApp.vueApp.use(VueTablerIcons)
})
