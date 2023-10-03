import { useEffect } from 'react';
import AuthContext from './auth';
import { useState } from 'react';

const AuthProvider = props => {
  const [isLogged, setIsLogged] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [role, setRole] = useState('TVV');
  const [name, setName] = useState('');

  const checkAuthHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_HOSTNAME + '/check-auth',
        {
          credentials: 'include',
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.isLoggedIn) {
        setIsLogged(true);
        setRole(data.role);
        setName(data.name);
      } else {
        setLoadingPage(false);
        setIsLogged(false);
      }
    } catch (err) {
      setLoadingPage(false);
      window.alert(err.message);
    }
  };

  useEffect(() => {
    setLoadingPage(true);
    checkAuthHandler();
  }, []);

  const onCheckAuth = () => {
    checkAuthHandler();
  };

  const onLogoutHandler = () => {
    setIsLogged(false);
    setLoadingPage(false);
  };

  const authContext = {
    isLogged,
    role,
    name,
    loadingPage,
    onCheck: onCheckAuth,
    onLogout: onLogoutHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
