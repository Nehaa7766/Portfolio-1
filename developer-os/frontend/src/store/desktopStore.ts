import { create } from "zustand";

interface DesktopStore {
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  isStartMenuOpen: false,
  toggleStartMenu: () =>
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),
}));
