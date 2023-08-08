export default defineNuxtPlugin(({ $router }) => {
  $router.options.scrollBehavior = (to: { hash: any }) => {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            top: 150,
            behavior: 'smooth'
          })
        }, 300)
      })
    }
  }
})
