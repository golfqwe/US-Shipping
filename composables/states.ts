export const useUserStore = () => useState<object>('userInfo', () => ({}))
export const useToken = () => useState<string>('token', () => '')
