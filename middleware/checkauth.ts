import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)

  if (!userInfo) {
    return navigateTo('/login')
  }

  const path = to.path
  const regex = /\/admin\b/g

  if (regex.test(path)) {
    if (userInfo?.value?.role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'You don\'t have permisstion to access to this pages.' })
    }
  }
})
