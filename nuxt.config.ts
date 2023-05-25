// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  plugins: [
    { src: '~/plugins/vuetify.ts', mode: 'client' }
  ],
  typescript: { shim: false },
  build: {
    transpile: ['vuetify']
  },
  app: {
    baseURL: process.env.BASE_URL
  },
  modules: ['@sidebase/nuxt-auth'],
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL
    },
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME
  }

})
