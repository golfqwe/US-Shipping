import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const userInfo = ref({})

  function setUserInfo (value: object) {
    Object.assign(userInfo.value, value)
  }

  function clearUserInfo () {
    userInfo.value = {}

    sessionStorage.removeItem('userStore')
  }

  return { setUserInfo, userInfo, clearUserInfo }
})
