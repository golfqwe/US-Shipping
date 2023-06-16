import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
// import Cookies from 'js-cookie'
// import cookie from 'cookie'

export default defineNuxtPlugin(({ $pinia, ssrContext }) => {
  $pinia.use(
    createPersistedStatePlugin({
      // plugin options goes here
      storage: window.sessionStorage
    })
  )
})
