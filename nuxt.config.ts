// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  build: {
    transpile: ['vuetify']
  },
  app: {
    // baseURL: '/US-Shipping/',
    // buildAssetsDir: '/_nuxt/',
    cdnURL: ''
  }

})
