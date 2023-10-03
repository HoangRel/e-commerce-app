import { useLoaderData, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Total from './Total';
import { useEffect, useState } from 'react';
import Quantity from '../Quantity';
import { DeleteIcon } from '../../icons/icons';

import styles from './Shopping.module.css';

const Shopping = ({ load }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const isLogged = useSelector(state => state.auth.isLogged);

  const data = useLoaderData();

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const totalPrice = data.reduce(
        (acc, cur) => acc + cur.price * cur.quantity,
        0
      );
      setTotalPrice(totalPrice);
    }
  }, [data]);

  //

  const deleteProductHandler = async productId => {
    const response = await fetch(
      process.env.REACT_APP_HOSTNAME + '/shop/delete-cart-product',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prodId: productId }),
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      window.alert(data.message);
      return navigate('/');
    }

    setDeleting(false);
    return navigate('/cart');
  };

  //
  const clickDeleteHandler = id => {
    setDeleting(true);

    deleteProductHandler(id);
  };

  return (
    <section className={styles.section}>
      <h2>Shopping Cart</h2>
      <div>
        <div className={styles.cart}>
          {isLogged ? (
            <div>
              <div className={styles.title}>
                <h4>Image</h4>
                <h4>Product</h4>
                <h4>Price</h4>
                <h4>Quantity</h4>
                <h4>Total</h4>
                <h4>Remove</h4>
              </div>
              {data && data.length > 0 ? (
                <ul>
                  {data &&
                    data.map(mov => (
                      <li key={mov.id}>
                        <img src={mov.img} alt={mov.name} />
                        <h4>{mov.name}</h4>
                        <p>
                          {Intl.NumberFormat('vi-VI').format(mov.price)}
                          <br />
                          VND
                        </p>
                        <div>
                          <Quantity
                            load={load}
                            productId={mov.id}
                            initialQuantity={mov.quantity}
                          />
                        </div>
                        <p>
                          {Intl.NumberFormat('vi-Vi').format(
                            mov.price * mov.quantity
                          )}
                          <br />
                          VND
                        </p>
                        {!deleting && (
                          <i onClick={() => clickDeleteHandler(mov.id)}>
                            <DeleteIcon />
                          </i>
                        )}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className='message'>Rỗng</p>
              )}
            </div>
          ) : (
            <p className='message'>Mời đăng nhập!</p>
          )}

          <div className={styles.navigate}>
            <button
              className='btn_continue'
              onClick={() => {
                navigate('/shop');
              }}
            >
              <strong>&larr;</strong> Continue shopping
            </button>
            {isLogged ? (
              <>
                {!deleting && !load && (
                  <button
                    className='btn_proceed'
                    onClick={() => {
                      navigate('/checkout', { state: { data, totalPrice } });
                    }}
                  >
                    Proceed to checkout <strong>&rarr;</strong>
                  </button>
                )}
              </>
            ) : (
              <button
                className='btn_proceed'
                onClick={() => {
                  navigate('/login');
                }}
              >
                Login <strong>&rarr;</strong>
              </button>
            )}
          </div>
        </div>
        <Total totalPrice={totalPrice} />
      </div>
    </section>
  );
};

export default Shopping;
