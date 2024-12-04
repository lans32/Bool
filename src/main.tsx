import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Импортируем Provider
import store from './store';

import AuthPage from './pages/AuthPage/AuthPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import API from "./api/API";

async function initializeCsrfToken() {
  try {
    const csrfToken = await API.getCsrfToken();
    if (csrfToken) {
      document.cookie = `csrftoken=${csrfToken}; path=/; SameSite=Strict`;
    }
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }
}

async function main() {
  // Получение CSRF-токена перед инициализацией React-приложения
  await initializeCsrfToken();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter> {/* basename="/Bool" */}
    <Provider store={store}> {/* Оборачиваем приложение в Provider */}
      <App />
    </Provider>
  </BrowserRouter>
);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/Bool/sw.js')
        .then(() => console.log('service worker registered'))
        .catch((err) => console.log('service worker not registered', err));
    });
  }
}

main();