import { create } from 'zustand'

type AuthState = {
  isLoggedIn: boolean
  companyData: {
    companyId: string
    firstName: string
    lastName: string
  } | null
  login: (data: AuthState['companyData']) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  companyData: null,
  login: (data) =>
    set(() => ({
      isLoggedIn: true,
      companyData: data,
    })),
  logout: () =>
    set(() => ({
      isLoggedIn: false,
      companyData: null,
    })),
}))