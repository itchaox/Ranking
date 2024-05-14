/*
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2024-05-06 18:47
 * @LastAuthor : itchaox
 * @LastTime   : 2024-05-10 22:41
 * @desc       :
 */

import ReactDOM from 'react-dom/client';
import 'normalize.css';
import App from './App';

import { bitable } from '@lark-base-open/js-sdk';

window.bitable = bitable;

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(<App />);
