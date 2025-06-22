import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type PageSection = {
  id: string
  title: string
  content: string
  type: string
}

type CompanyState = {
  companyData: {
    id: string
    name: string
    pageSections: PageSection[]
  } | null
  setCompanyData: (data: CompanyState['companyData']) => void
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companyData: null,
      setCompanyData: (data) =>
        set(() => ({
          companyData: data,
        })),
    }),
    {
      name: 'company-storage', // Unique key for localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
)