import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header className="header">
      <div className={`header__container _container ${menuActive ? 'active' : ''}`}>
        
        {/* Логотип и название сайта в одном контейнере */}
        <div className="header__branding">
          <Link to="/" className="header__logo">
            <img src="/Bool/logo.png" alt="Logo" />
          </Link>
          <span className="header__title">Логика</span>
        </div>

        {/* Бургер-меню */}
        <div
          className={`header__burger ${menuActive ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
        </div>

        <nav className={`header__menu menu ${menuActive ? 'active' : ''}`}>
          <ul className="menu__list">
            <li className="menu__item">
              <Link
                to="/operations"
                className="menu__link menu__link_active"
                onClick={toggleMenu}
              >
                Операции
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
