// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  plugins: [
    { src: '~/plugins/vuetify.ts', mode: 'client' },
    { src: '~/plugins/ckeditorPlugin.ts', mode: 'client' }
  ],
  typescript: { shim: false },
  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      apiBase: process.env.API_URL || '/api'
    }
  },
  vite: {
    server: {
      proxy: {
        '^/api': {
          target: process.env.API_URL,
          changeOrigin: true
        }
      }
    }
  },
  modules: [
    '@pinia/nuxt'
  ]

})
