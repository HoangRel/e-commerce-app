import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { popupActions } from '../redux-store/popup';

import BannerHome from '../components/homePage/BannerHome';
import Category from '../components/homePage/Category';
import Products from '../components/homePage/Products';
import Others from '../components/homePage/Others';
import Popup from '../components/homePage/Popup';

const HomePage = () => {
  // show Popup
  const showPopup = useSelector(state => state.popup.isShowPopup);
  const data = useSelector(state => state.popup.data);

  const dispatch = useDispatch();

  // hide popup khi quay lại trang Home
  useEffect(() => {
    return () => {
      dispatch(popupActions.HIDE_POPUP());
    };
  }, [dispatch]);

  return (
    <>
      {showPopup && <Popup data={data} />}
      <BannerHome />
      <Category />
      <Products />
      <Others />
    </>
  );
};

export default HomePage;

export const loader = async () => {
  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/shop/products',
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return data;
};
