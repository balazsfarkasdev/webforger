import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthState = {
  isLoggedIn: boolean
  userData: {
    id: string,
    firstName: string,
    lastName: string,
    email: string
    companyId: string
  }
  login: (user: { firstName: string, lastName: string, email: string, companyId: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userData: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        companyId: ''
      },
      login: (user) =>
        set(() => ({
          isLoggedIn: true,
          userData: {
            id: user.companyId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            companyId: user.companyId
          }
        })),
      logout: () =>
        set(() => ({
          isLoggedIn: false,
          userData: {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            companyId: ''
          }
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)