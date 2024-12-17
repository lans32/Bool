import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'null');
  
  const breadcrumbsMapping: Record<string, string> = {
    '': 'Главная',
    'operations': 'Операции',
    'edit-operations': 'Редактировать операции', // Добавлено
    'operation': 'Описание',
    'edit-operation': 'Редактировать детали операции', // Добавлено
    'auth': 'Авторизация',
    'asks': 'Заявки',
    'profile': 'Профиль'
  };

  return (
    <nav className="breadcrumbs">
      <span>
        <Link to="/">{breadcrumbsMapping['']}</Link> {}
      </span>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

        const isNumber = !isNaN(Number(pathname)) || pathname === 'null';

        if (isNumber) return null;

        const isLast = index === pathnames.length - 1;

        return (
          <span key={routeTo}>
            {' > '}
            {pathname === 'operations' ? (
              <Link to="/operations">
                {breadcrumbsMapping[pathname]}
              </Link>
            ) : pathname === 'edit-operations' ? ( // Обработка edit-operations
              <>
                <Link to="/operations">{breadcrumbsMapping['operations']}</Link>
                {' > '}
                <span>{breadcrumbsMapping[pathname]}</span>
              </>
            ) : pathname === 'edit-operation' ? ( // Обработка edit-operation
              <>
                <Link to="/operations">{breadcrumbsMapping['operations']}</Link>
                {' > '}
                <Link to="/edit-operations">{breadcrumbsMapping['edit-operations']}</Link>
                {' > '}
                <span>{breadcrumbsMapping[pathname]}</span>
              </>
            ) : pathname === 'operation' ? (
              <>
                <Link to="/operations">{breadcrumbsMapping['operations']}</Link>
                {' > '}
                <Link to={`${location.pathname}`}>
                  {breadcrumbsMapping[pathname]}
                </Link>
              </>
            ) : isLast ? (
              <span>{breadcrumbsMapping[pathname] || pathname}</span>
            ) : (
              <Link to={routeTo}>
                {breadcrumbsMapping[pathname] || pathname}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;