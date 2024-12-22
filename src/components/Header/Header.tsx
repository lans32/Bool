import { Link, useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import './Header.css';
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login, logoutUser } from "../../slices/userSlice";
import { resetFilters } from "../../slices/operationsSlice";
import API from "../../api/API";
import { getCookie, deleteCookie } from "../../api/Utils";

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, userName, isStaff } = useAppSelector((state) => state.user);
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    const sessionId = getCookie("session_id");
    if (sessionId) {
      const checkSession = async () => {
        try {
          const sessionData = await API.getSession();
          if (sessionData.username) {
            dispatch(
              login({ username: sessionData.username, isStaff: sessionData.isStaff })
            );
          } else {
            dispatch(logoutUser());
          }
        } catch (error) {
          console.error("Ошибка при проверке сессии:", error);
          dispatch(logoutUser());
        }
      };
      checkSession();
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      deleteCookie("session_id");
      dispatch(resetFilters());
      navigate("/");
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  };

  return (
    <header className="header">
      <div className={`header__container _container ${menuActive ? 'active' : ''}`}>
        <div className="header__branding">
          <Link to="/" className="header__logo">
            <img src="/logo.png" alt="Logo" />
          </Link>
          <span className="header__title">Логика</span>
        </div>

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
                to={isStaff ? "/edit-operations" : "/operations"}
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
