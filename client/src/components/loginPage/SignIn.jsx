import { useEffect, useState } from 'react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';

import useInput from '../hooks/useInput';

// dùng chung file css với Sign Up
import styles from '../registerPage/SignUp.module.css';
import usePostAuth from '../hooks/useFostAuth';

const SignIn = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const [errors, setErrors] = useState([]);

  // nhận dữ liệu từ custom Hook
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(value => value.includes('@'));

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput(value => value.trim() !== '');

  let isFormValid = false;

  if (enteredEmailIsValid && enteredPasswordIsValid) {
    isFormValid = true;
  }

  const { runFetchAPI, resData, error } = usePostAuth();

  //
  const submitHanlder = event => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    const formData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    runFetchAPI(formData, 'login');
  };

  useEffect(() => {
    if (resData) {
      resetEmailInput();
      resetPasswordInput();

      navigate('/');
    }

    if (error) {
      setErrors(error);
    }
  }, [resData, navigate, resetEmailInput, resetPasswordInput, error]);

  const emailInputClasses =
    emailInputHasError || errors?.some(error => error.path === 'email')
      ? styles.invalid
      : '';
  const passwordInputClasses =
    passwordInputHasError || errors?.some(error => error.path === 'password')
      ? styles.invalid
      : '';

  const isSubmitting = navigation.state === 'submitting';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1>Sign In</h1>
        <form className={styles.form} onSubmit={submitHanlder}>
          <div className={emailInputClasses}>
            {emailInputHasError && (
              <nav className={styles.error}>Mời nhập Email chuẩn dạng!</nav>
            )}

            {!emailInputHasError &&
              errors?.some(error => error.path === 'email') && (
                <nav className={styles.error}>
                  {errors.find(error => error.path === 'email').msg}
                </nav>
              )}

            <input
              type='email'
              placeholder='Email'
              value={enteredEmail}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              required
            ></input>
          </div>
          <div className={passwordInputClasses}>
            {passwordInputHasError && (
              <nav className={styles.error}>Mời nhập Password!</nav>
            )}
            {!passwordInputHasError &&
              errors?.some(error => error.path === 'password') && (
                <nav className={styles.error}>
                  {errors.find(error => error.path === 'password').msg}
                </nav>
              )}

            <input
              type='password'
              placeholder='Password'
              value={enteredPassword}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              required
            ></input>
          </div>

          <button disabled={isSubmitting}>SIGN IN</button>
        </form>
        <p>
          Create an account?&nbsp;
          <Link to='/register' className={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignIn;
