export const useUserStore = () => useState<object>('userInfo', () => ({}))
export const useToken = () => useState<string>('token', () => '')
export const useUserName = () => useState<string>('userName', () => '')
export const useUserId = () => useState<string>('userId', () => '')
