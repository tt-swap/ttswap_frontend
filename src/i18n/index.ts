import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUS from './locales/en.json';
import zhCN from './locales/zh.json';

const resources = {
  'en': {
    translation: enUS,
  },
  'zh': {
    translation: zhCN,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    lng: 'zh',
    // resources: {
    //   en: { translation: require('./locales/en.json') },
    //   zh: { translation: require('./locales/zh.json') }
    // },
    react: {
      useSuspense: true,
    },
    supportedLngs: ['en', 'zh']
  });

export default i18n;