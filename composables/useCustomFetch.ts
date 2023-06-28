import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

export function useCustomFetch<T> (url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const router = useRouter()

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  const { clearUserInfo } = userStore

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBase,
    // cache request
    key: url,

    // set user token if connected
    headers: userInfo?.value.token
      ? { Authorization: `Bearer ${userInfo?.value.token}`, 'Access-Control-Allow-Origin': '*' }
      : {},

    onResponse (_ctx) {
      // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
    },

    onResponseError (_ctx) {
      if (_ctx.response.status === 401) {
        clearUserInfo()
        router.push({ path: '/login' })
      }
    }
  }

  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults)

  return useLazyFetch(url, params)
}
