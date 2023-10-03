import { createContext } from 'react';

const AuthContext = createContext({
  isLogged: false,
  role: 'TVV',
  name: '',
  loadingPage: false,
  onCheck: () => {},
  onLogout: () => {},
});

export default AuthContext;
