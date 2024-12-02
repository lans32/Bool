import './App.css'
import Header from './components/Header/Header'
import './styles/null.css'
import './styles/style.css'

import HomePage from './pages/HomePage/HomePage'

import { Routes, Route, useLocation } from 'react-router-dom';
import OperationsPage from './pages/OperationsPage/OperationsPage'
import OperationPage from './pages/OperationPage/OperationPage'
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs'
import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core';

function App() {
  useEffect(() => {
    // Вызов команды Tauri при монтировании компонента
    invoke('create')
      .then((response: any) => console.log('Create command response:', response))
      .catch((error: any) => console.error('Error invoking create command:', error));

    // Возвращаем функцию очистки
    return () => {
      invoke('close')
        .then((response: any) => console.log('Close command response:', response))
        .catch((error: any) => console.error('Error invoking close command:', error));
    };
  }, []);

  const location = useLocation();

  return (
    <>
      <Header />

      {/* Условно рендерим Breadcrumbs ниже Header, но только на страницах, кроме главной */}
      {location.pathname !== '/' && <Breadcrumbs />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/operation/:id" element={<OperationPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
