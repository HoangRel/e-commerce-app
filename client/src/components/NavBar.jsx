import { NavLink } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { CartIcon, LoginIcon } from '../icons/icons';

import { authActions, checkAuthAsync } from '../redux-store/auth';

import { useEffect } from 'react';
import { useSubmit } from 'react-router-dom';

import ChatPopup from '../components/chatPopup/ChatPopup';

import styles from './NavBar.module.css';

const NavBar = () => {
  const submit = useSubmit();

  const dispatch = useDispatch();

  const isLogged = useSelector(state => state.auth.isLogged);
  const currentAcc = useSelector(state => state.auth.currentAcc);

  useEffect(() => {
    // Gọi async action khi component được mount
    dispatch(checkAuthAsync());
  }, [dispatch]);

  // Kích hoạt action theo chường trình
  const logoutHandler = () => {
    const isLogout = window.confirm('Logout ?');
    if (isLogout) {
      submit(null, { action: '/logout', method: 'POST' });
      dispatch(authActions.ON_LOGOUT());
    }
  };

  return (
    <>
      <header>
        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/shop'
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                Shop
              </NavLink>
            </li>
            {isLogged && (
              <li>
                <NavLink
                  to='/history'
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  History
                </NavLink>
              </li>
            )}
          </ul>
          <h2>BOUTIQUE</h2>
          <ul>
            <li>
              <NavLink
                to='/cart'
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                <i>
                  <CartIcon />
                </i>
                Cart
              </NavLink>
            </li>

            {!isLogged ? (
              <li>
                <NavLink
                  to='/login'
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  <i>
                    <LoginIcon />
                  </i>
                  Login
                </NavLink>
              </li>
            ) : (
              <>
                <li className={styles.acc}>
                  <i>
                    <LoginIcon />
                  </i>
                  <select>
                    <option>{currentAcc}</option>
                    <option>{currentAcc}</option>
                    <option>{currentAcc}</option>
                  </select>
                </li>
                <li>
                  <button onClick={logoutHandler}>( logout )</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      {isLogged && <ChatPopup />}
    </>
  );
};

export default NavBar;
