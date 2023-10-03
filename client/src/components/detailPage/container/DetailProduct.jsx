import { useState, useEffect } from 'react';
import styles from './DetailProduct.module.css';

import { useNavigate } from 'react-router-dom';

import Quantity from '../Quantity';

const DetailProduct = ({ product }) => {
  const [isViewImg, setIsViewImg] = useState(product.img1);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // thay đổi ảnh lớn
  const clickHandler = src => {
    setIsViewImg(src);
  };

  useEffect(() => {
    setIsViewImg(product.img1);
  }, [product.img1]);

  //
  const changeQuantityHander = quantity => {
    setQuantity(quantity);
  };

  const postToCartHandler = async (prodId, quantity) => {
    const formData = { prodId, quantity };

    const response = await fetch(
      process.env.REACT_APP_HOSTNAME + '/shop/add-cart',
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
      window.alert(data.message);
      return navigate('/');
    }

    window.alert(data.message);
    return navigate('/shop');
  };

  const addToCartHandler = event => {
    event.preventDefault();
    setLoading(true);

    postToCartHandler(product._id, quantity);
  };

  return (
    <section className={styles.product}>
      <div className={styles.imgs}>
        <img
          src={product.img1}
          alt={product.name}
          onClick={() => clickHandler(product.img1)}
        />
        <img
          src={product.img2}
          alt={product.name}
          onClick={() => clickHandler(product.img2)}
        />
        <img
          src={product.img3}
          alt={product.name}
          onClick={() => clickHandler(product.img3)}
        />
        <img
          src={product.img4}
          alt={product.name}
          onClick={() => clickHandler(product.img4)}
        />
        <img src={isViewImg} alt={product.name} />
      </div>
      <div className={styles.detail}>
        <div>
          <h1>{product.name}</h1>
          <p>{`${Intl.NumberFormat('vi-VI').format(product.price)} VND`}</p>
          <blockquote>{product.short_desc}</blockquote>
        </div>
        <div className={styles.category}>
          <h5>CATEGORY: </h5>
          <span>{product.category}</span>
        </div>
        <form className={styles.navigate} onSubmit={addToCartHandler}>
          <p>QUANTITY</p>
          <Quantity
            changeQuantityHander={changeQuantityHander}
            initialQuantity='1'
          />

          {!loading && <button>Add to cart</button>}
        </form>
      </div>
    </section>
  );
};

export default DetailProduct;
