/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-06 18:47
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-21 00:17
 * @desc       :
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { semiTheming } from 'vite-plugin-semi-theming';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    semiTheming({
      theme: '@semi-bot/semi-theme-feishu-dashboard',
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5050,
    proxy: {
      '/api': 'https://api.apiusb.com/api/app?service=App.NumbersFormula.RandomNumberGenerator&num=8&min=7&max=15',
    },
  },
});
