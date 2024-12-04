import { Link, useNavigate  } from 'react-router-dom';
import {  FC, useEffect, useState } from 'react';
import './Header.css';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { login, logout } from "../../slices/userSlice";
import { resetFilters } from "../../slices/operationsSlice";
import API from "../../api/API";
import { getCookie, deleteCookie } from "../../api/Utils";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для навигации
  const { isLoggedIn, userName } = useSelector((state: RootState) => state.user);
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    const sessionId = getCookie("session_id");
    if (sessionId) {
      const checkSession = async () => {
        try {
          const response = await API.getSession();
          const data = await response.json();
          if (data.status === "ok" && data.username) {
            dispatch(login(data.username));
          }
        } catch (error) {
          console.error("Error fetching session:", error);
        }
      };
      checkSession();
    }
  }, [dispatch]);
  
  const handleLogout = async () => {
    try {
      dispatch(logout());
      dispatch(resetFilters());
      await API.logout();
      deleteCookie("session_id");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  return (
    <header className="header">
      <div className={`header__container _container ${menuActive ? 'active' : ''}`}>
        
        {/* Логотип и название сайта в одном контейнере */}
        <div className="header__branding">
          <Link to="/" className="header__logo">
            <img src="/logo.png" alt="Logo" />
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
            <li className="menu__item">
              <Link
                to="/asks"
                className="menu__link menu__link_active"
                onClick={toggleMenu}
              >
                Заявки
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="menu__item">
                  <Link to="/profile"><span>{userName}</span></Link>
                </li>
                <li className="menu__item">
                  <button onClick={handleLogout} className="menu__link menu__link_active">Выйти</button>
                  </li>
              </>
            ) : (
              <li className="menu__item">
                <Link to="/auth">
                  <button className="menu__link menu__link_active">Войти</button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
