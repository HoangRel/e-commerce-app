import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth';
import { useEffect } from 'react';
import styles from './login.module.css';

const Login = () => {
  const [mess, setMess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();
  const passRef = useRef();

  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.isLogged) {
      return navigate('/admin');
    }
    return;
  }, [authCtx.isLogged, navigate]);

  const fetchAuth = async user => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_HOSTNAME + '/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email: user.email, password: user.password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 500) {
          window.alert(data.message);
          return navigate('/');
        }

        throw new Error(data.message);
      }

      setIsLoading(false);

      authCtx.onCheck();

      window.alert(data.message);
      return navigate('/admin');
    } catch (err) {
      setIsLoading(false);
      return setMess(err.message);
    }
  };

  const loginHandler = event => {
    event.preventDefault();

    const emailValue = emailRef.current.value;

    if (emailValue.trim().length === 0 || !emailValue.includes('@')) {
      return setMess('Nhập email hợp lệ');
    }

    const passValue = passRef.current.value;

    if (passValue.length < 6) {
      return setMess('Nhập password từ 6 ký tự');
    }

    setMess(null);

    fetchAuth({ email: emailValue, password: passValue });
  };

  return (
    <section className={styles.section}>
      {authCtx.loadingPage ? (
        <p>Loading...</p>
      ) : (
        <>
          {mess && <p className={styles.mess}>{mess}</p>}
          <form onSubmit={loginHandler}>
            <label>
              Email
              <input type='email' ref={emailRef} />
            </label>
            <label>
              Password
              <input type='password' ref={passRef} />
            </label>
            {!isLoading ? (
              <button type='submit'>Login</button>
            ) : (
              <button disabled>Logging in....</button>
            )}
          </form>
        </>
      )}
    </section>
  );
};

export default Login;
