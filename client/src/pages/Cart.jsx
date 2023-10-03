import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import Shopping from '../components/cartPage/Shopping';
import { redirect, useLocation, useNavigation } from 'react-router-dom';

const CartPage = () => {
  const [errMsg, setErrMsg] = useState('');

  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      setErrMsg(state);
    }
  }, [state]);

  const navigation = useNavigation();

  const loadingCart = navigation.state === 'loading';

  return (
    <>
      <Banner page='cart' />
      {errMsg && (
        <div style={{ marginTop: '3rem' }}>
          <h4>{errMsg.message}</h4>
          <hr />
          <hr />
          <p>Một vài sản phẩm cần được thay đổi số lượng cho phù hợp là:</p>
          <hr />
          {errMsg.resData &&
            errMsg.resData.map(mov => (
              <div key={mov.prodId}>
                <h5>{mov.name}</h5>
                <h6>available: {mov.count}</h6>
                <hr />
              </div>
            ))}
        </div>
      )}
      <Shopping load={loadingCart} />
    </>
  );
};

export default CartPage;

export async function loader() {
  const response = await fetch(process.env.REACT_APP_HOSTNAME + '/shop/carts', {
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      window.alert(data.message);
      return redirect('/');
    }

    return [];
  }

  return data;
}
