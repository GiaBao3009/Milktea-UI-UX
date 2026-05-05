import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './assets/i18n/vi.json';
import en from './assets/i18n/en.json';

const resources = {
  vi: { translation: vi },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'vi',
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
