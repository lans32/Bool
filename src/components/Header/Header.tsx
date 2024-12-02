import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {

  return (
    <header className="header">
      <div className="header__container">
        
        {/* Логотип и название сайта в одном контейнере */}
        <div className="header__branding">
          <Link to="/" className="header__logo">
            <img src="/logo.png" alt="Logo" />
          </Link>
          <span className="header__title">Логика</span>
        </div>

        <nav className="header__menu">
          <ul className="menu__list">
            <li className="menu__item">
              <Link to="/operations" className="menu__link menu__link_active">Операции</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
