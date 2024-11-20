import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Импортируем Provider
import { store } from './store'; // Подключаем созданный store

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}> {/* Оборачиваем приложение в Provider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
