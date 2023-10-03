import { Link, useNavigate, useNavigation } from 'react-router-dom';

import useInput from '../hooks/useInput';
import usePostAuth from '../hooks/useFostAuth';

import styles from './SignUp.module.css';
import { useEffect, useState } from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const [errors, setErrors] = useState([]);

  // nhận dữ liệu về từ việc gọi custom hook
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput(value => value.trim() !== '');

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
  } = useInput(value => value.trim().length >= 6);

  const {
    value: enteredPhone,
    isValid: enteredPhoneIsValid,
    hasError: phoneInputHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    reset: resetPhoneInput,
  } = useInput(
    value =>
      !isNaN(parseFloat(value)) && isFinite(value) && value.trim().length >= 9
  );

  const { runFetchAPI, resData, error } = usePostAuth();

  // valid mặc định là k hợp lệ
  let formIsValid = false;

  if (
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    enteredPhoneIsValid
  ) {
    // chỉ hợp lệ sau khi true tất cả
    formIsValid = true;
  }

  // submit
  const formSubmitHandler = event => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    const formData = {
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
      phone: enteredPhone,
    };

    runFetchAPI(formData, 'signup');
  };

  useEffect(() => {
    if (resData) {
      resetNameInput();
      resetEmailInput();
      resetPasswordInput();
      resetPhoneInput();

      navigate('/login');
    }

    if (error) {
      setErrors(error);
    }
  }, [
    resData,
    navigate,
    resetEmailInput,
    resetNameInput,
    resetPasswordInput,
    resetPhoneInput,
    error,
  ]);

  // css cho input không hợp lệ
  const nameInputClasses =
    nameInputHasError || errors?.some(error => error.path === 'name')
      ? styles.invalid
      : '';

  const emailInputClasses =
    emailInputHasError || errors?.some(error => error.path === 'email')
      ? styles.invalid
      : '';

  const passwordInputClasses =
    passwordInputHasError || errors?.some(error => error.path === 'password')
      ? styles.invalid
      : '';

  const phoneInputClasses =
    phoneInputHasError || errors?.some(error => error.path === 'phone')
      ? styles.invalid
      : '';

  const isSubmitting = navigation.state === 'submitting';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1>Sign Up</h1>
        <form className={styles.form} onSubmit={formSubmitHandler}>
          <div className={nameInputClasses}>
            {nameInputHasError && (
              <nav className={styles.error}>Mời nhập Full Name</nav>
            )}
            {!nameInputHasError &&
              errors?.some(error => error.path === 'name') && (
                <nav className={styles.error}>
                  {errors.find(error => error.path === 'name').msg}
                </nav>
              )}
            <input
              type='text'
              placeholder='Full Name'
              value={enteredName}
              required
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
            ></input>
          </div>
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
              required
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            ></input>
          </div>
          <div className={passwordInputClasses}>
            {passwordInputHasError && (
              <nav className={styles.error}>Mời nhập Password từ 6 ký tự!</nav>
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
              required
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            ></input>
          </div>
          <div className={phoneInputClasses}>
            {phoneInputHasError && (
              <nav className={styles.error}>Mời nhập SĐT chính xác!</nav>
            )}
            {!phoneInputHasError &&
              errors?.some(error => error.path === 'phone') && (
                <nav className={styles.error}>
                  {errors.find(error => error.path === 'phone').msg}
                </nav>
              )}
            <input
              type='number'
              placeholder='Phone'
              value={enteredPhone}
              required
              onChange={phoneChangeHandler}
              onBlur={phoneBlurHandler}
            ></input>
          </div>
          <button disabled={isSubmitting}>SIGN UP</button>
        </form>
        <p>
          Login?&nbsp;
          <Link to='/login' className={styles.link}>
            Click
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
