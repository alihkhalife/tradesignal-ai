import { create } from 'zustand'

interface SettingsState {
  sidebarCollapsed: boolean
  aiPanelVisible: boolean
  toggleSidebar: () => void
  toggleAiPanel: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setAiPanelVisible: (visible: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  sidebarCollapsed: false,
  aiPanelVisible: true,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleAiPanel: () => set((state) => ({ aiPanelVisible: !state.aiPanelVisible })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setAiPanelVisible: (visible) => set({ aiPanelVisible: visible }),
}))
