import { useState } from 'react';
import useInput from '../../components/hooks/useInput';

import styles from './Billings.module.css';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Billings = ({ cartData, totalPrice }) => {
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const postCart = async formData => {
    const response = await fetch(
      process.env.REACT_APP_HOSTNAME + '/shop/order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 500) {
        window.alert(data.message);
        return navigate('/');
      }

      if (response.status === 400) {
        return navigate('/cart', { state: data });
      }

      if (response.status === 401) {
        window.alert(data.message);
        return navigate('/shop');
      }

      if (response.status === 422) {
        setErrors(data.msg);
        return;
      }

      window.alert(data.message);
      return;
    }

    window.alert(data.message);

    resetNameInput();
    resetEmailInput();
    resetPhoneInput();
    resetAddressInput();

    return navigate('/');
  };

  // từ custom hook useInput
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

  const {
    value: enteredAddress,
    isValid: enteredAddressIsValid,
    hasError: addressInputHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddressInput,
  } = useInput(value => value.trim() !== '');

  // xét valid form
  let isValid = false;

  if (
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredPhoneIsValid &&
    enteredAddressIsValid
  ) {
    isValid = true;
  }

  //
  const onSubmitHandler = event => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    const contact = {
      name: enteredName,
      email: enteredEmail,
      phone: enteredPhone,
      address: enteredAddress,
      totalPrice,
    };

    postCart(contact);
  };

  return (
    <section>
      <h2>Billings details</h2>
      <div className={styles.container}>
        <form onSubmit={onSubmitHandler}>
          <label
            htmlFor='name'
            className={
              nameInputHasError || errors.includes('name') ? styles.valid : ''
            }
          >
            Full Name:
          </label>
          <input
            id='name'
            value={enteredName}
            placeholder='Enter Your Full Name Here!'
            required
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          <label
            htmlFor='email'
            className={
              emailInputHasError || errors.includes('email') ? styles.valid : ''
            }
          >
            Email:
          </label>
          <input
            id='email'
            type='email'
            value={enteredEmail}
            placeholder='Enter Your Email Here!'
            required
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          <label
            className={
              phoneInputHasError || errors.includes('phone') ? styles.valid : ''
            }
            htmlFor='phone'
          >
            Phone Number:
          </label>
          <input
            id='phone'
            type='number'
            value={enteredPhone}
            placeholder='Enter Your Phone Number Here!'
            required
            onChange={phoneChangeHandler}
            onBlur={phoneBlurHandler}
          />
          <label
            htmlFor='address'
            className={
              addressInputHasError || errors.includes('address')
                ? styles.valid
                : ''
            }
          >
            Address:
          </label>
          <input
            id='address'
            placeholder='Enter Your Address Here!'
            value={enteredAddress}
            required
            onChange={addressChangeHandler}
            onBlur={addressBlurHandler}
          />
          {cartData && cartData.length > 0 ? (
            <button type='submit'>Place Order</button>
          ) : (
            <Link to='/shop'>to shop?</Link>
          )}
        </form>
        <div className={styles.wrap}>
          <h2>Your order</h2>
          {cartData.map(mov => (
            <div key={mov.id} className={styles.item}>
              <h5>{mov.name.split(' ').slice(0, 4).join(' ')}</h5>
              <p>
                {Intl.NumberFormat('vi-VI').format(mov.price)} VND x{' '}
                {mov.quantity}
              </p>
            </div>
          ))}
          <div className={styles.total}>
            <h4>Total</h4>
            <p>{Intl.NumberFormat('vi-VI').format(totalPrice)} VND</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billings;
