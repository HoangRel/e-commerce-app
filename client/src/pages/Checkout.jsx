import { useLocation, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import Billings from '../components/checkoutPage/Billings';
import { useEffect } from 'react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  const obj = {
    home: 'Home',
    cart: 'Cart',
  };

  return (
    <>
      <Banner page='Checkout' other='Checkout' navi='true' obj={obj} />
      {state && (
        <Billings cartData={state.data} totalPrice={state.totalPrice} />
      )}
    </>
  );
};

export default CheckoutPage;
