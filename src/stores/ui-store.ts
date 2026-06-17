import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  mobileNavOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void
  toggleMobileNav: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileNavOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
}))
