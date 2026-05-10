import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TenantState {
  activeCompanyId: string | null
  setActiveCompanyId: (companyId: string) => void
  clearActiveCompanyId: () => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      activeCompanyId: null,
      setActiveCompanyId: (companyId: string) => set({ activeCompanyId: companyId }),
      clearActiveCompanyId: () => set({ activeCompanyId: null }),
    }),
    {
      name: 'tenant-storage', // name of the item in the storage (must be unique)
    }
  )
)
