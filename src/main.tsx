import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Импортируем Provider
import { store } from './store'; // Подключаем созданный store

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/Bool">
    <Provider store={store}> {/* Оборачиваем приложение в Provider */}
      <App />
    </Provider>
  </BrowserRouter>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then(() => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
