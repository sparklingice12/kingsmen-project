import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { languageService } from '@/features/language/lib/language.service';
import { createTranslator } from '@/features/language/lib/language.utils';
import { languageConfig } from '@/features/language/language.config';

export const useStore = create(
  persist(
    (set, get) => ({
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

      // Language slice
      language: {
        currentLang: languageConfig.defaultLanguage,
        availableLanguages: languageService.getAvailableLanguages(),
        setLanguage: (lang) => set((s) => ({ language: { ...s.language, currentLang: lang } })),
        t: (path) => {
          const lang = get().language.currentLang;
          const translations = languageService.getTranslations();
          const translator = createTranslator(translations, lang, languageConfig.fallbackLanguage);
          return translator(path);
        },
      },

      // Background slice
      background: {
        backgroundImage: null,
        setBackgroundImage: (url) => set((s) => ({ background: { ...s.background, backgroundImage: url } })),
        resetBackgroundImage: () => set((s) => ({ background: { ...s.background, backgroundImage: null } })),
      },
    }),
    {
      name: 'space-garden-storage',
      partialize: (state) => ({
        language: { currentLang: state.language.currentLang },
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        language: {
          ...currentState.language,
          ...(persistedState.language || {}),
        },
      }),
    }
  )
);
