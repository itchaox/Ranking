/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2023-09-25 20:55
 * @LastAuthor : itchaox
 * @LastTime   : 2024-06-13 19:51
 * @desc       :
 */

import en from './en.json';
import zh from './zh.json';
import ja from './ja.json';

import { bitable } from '@lark-base-open/js-sdk';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ja: {
      translation: ja,
    },
    zh: {
      translation: zh,
    },
  },
  lng: 'en', // 默认语言
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // React 已经默认防止 XSS
  },
});

bitable.bridge.getLanguage().then((lang) => {
  i18n.changeLanguage(lang);
});

export default i18n;
