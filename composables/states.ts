export const useUserStore = () => useState<object>('userInfo', () => useDefaultUser().value)

export const useDefaultUser = (fallback = {}) => {
  const user = ref(fallback)
  if (localStorage.getItem('userInfo')) {
    user.value = JSON.parse(localStorage.getItem('userInfo') || '{}')
  }
  return user
}
export const useToken = () => useState<string>('token', () => '')
export const useUserName = () => useState<string>('userName', () => '')
export const useUserId = () => useState<string>('userId', () => '')

export const useColor = () => useState<string>('color', () => 'pink')
