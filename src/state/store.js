import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // UI slice
  ui: {
    theme: 'light',
    modal: null,
    setTheme: (theme) => {
      set((s) => ({ ui: { ...s.ui, theme } }));
      document.documentElement.classList.toggle('dark', theme === 'dark');
    },
    openModal: (id) => set((s) => ({ ui: { ...s.ui, modal: id } })),
    closeModal: () => set((s) => ({ ui: { ...s.ui, modal: null } })),
  },

  // Data slice
  data: {
    items: [],
    loading: false,
    error: null,
    setItems: (items) => set((s) => ({ data: { ...s.data, items } })),
    setLoading: (loading) => set((s) => ({ data: { ...s.data, loading } })),
    setError: (error) => set((s) => ({ data: { ...s.data, error } })),
  },
}));
