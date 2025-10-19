import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // debug: true,
    // saveMissing: true,
    // saveMissingTo: 'all',
    // missingKeyHandler: (lng, ns, key, fallbackValue) => {
    //   console.log(`Missing translation: ${lng}:${ns}:${key}`);
    // },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/common.json',
    },
    react: {
      useSuspense: true,
    },
    supportedLngs: ['en', 'zh']
  });

export default i18n;