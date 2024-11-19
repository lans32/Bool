import './App.css'
import Header from './components/Header/Header'
import './styles/null.css'
import './styles/style.css'

import HomePage from './pages/HomePage/HomePage'

import { Routes, Route, useLocation } from 'react-router-dom';
import OperationsPage from './pages/OperationsPage/OperationsPage'
import OperationPage from './pages/OperationPage/OperationPage'
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs'



const App = () => {
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
};

export default App