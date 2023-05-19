// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  build: {
    transpile: ['vuetify']
  },
  app: {
    baseURL: process.env.BASE_URL
  }

})
