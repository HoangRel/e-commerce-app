import { useRouteLoaderData, useNavigation } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { popupActions } from '../../redux-store/popup';

import ProductItem from '../ProductItem';

import styles from './Products.module.css';

const Products = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // request data from fectAPI
  const data = useRouteLoaderData('layout');

  // chỉ lấy hiển thị tối đa 8 phần tử
  const productsData = data.slice(0, 8);

  //
  const showPopupHandler = data => {
    dispatch(popupActions.SHOW_POPUP(data));
  };

  return (
    <section className={styles.section}>
      <p>Make the hard way</p>
      <h3>Top trending products</h3>

      {navigation.state === 'loading' && (
        <p className={styles.message}>Loading...</p>
      )}

      {productsData.length === 0 ? (
        <p className='message'>
          Tạm thời không có sản phẩm ở đây hoặc có thể đã xẫy ra lỗi!
        </p>
      ) : (
        <div className={styles.products}>
          {productsData.map(product => (
            <ProductItem
              key={product._id}
              product={product}
              onClick={() => showPopupHandler(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Products;
