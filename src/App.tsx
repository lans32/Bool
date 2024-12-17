import './App.css'
import Header from './components/Header/Header'
import './styles/null.css'
import './styles/style.css'

import HomePage from './pages/HomePage/HomePage'

import { Routes, Route, useLocation } from 'react-router-dom';
import OperationsPage from './pages/OperationsPage/OperationsPage'
import OperationPage from './pages/OperationPage/OperationPage'
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs'
import AuthPage from './pages/AuthPage/AuthPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AskPage from './pages/AskPage/AskPage'
import AsksPage from './pages/AsksPage/AsksPage'
import EditOperationsPage from './pages/EditOperationsPage/EditOperationsPage';
import EditOperationPage from './pages/EditOperationPage/EditOperationPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';

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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/operation/:id" element={<ProfilePage />} />
          <Route path="/asks/:id" element={<AskPage />} />
          <Route path="/asks" element={<AsksPage />} />
          <Route path="/edit-operations" element={<EditOperationsPage />} />
          <Route path="/edit-operation/:id" element={<EditOperationPage />} />
          <Route path="/error/:errorCode" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App