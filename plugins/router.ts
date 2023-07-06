export default defineNuxtPlugin(({ $router }) => {
  $router.options.scrollBehavior = (to: { hash: any }) => {
    if (to.hash) {
      return {
        el: to.hash,
        top: 0,
        behavior: 'smooth'
      }
    }
  }
})
