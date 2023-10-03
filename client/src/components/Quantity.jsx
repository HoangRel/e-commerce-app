import { useState } from 'react';
import styles from './Quantity.module.css';
import { useNavigate } from 'react-router-dom';

// component số lượng muốn add
const Quantity = ({ productId, initialQuantity, load }) => {
  const [quantity, setQuantity] = useState(Number(initialQuantity));
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const updateQuantityHandler = async (productId, quantity) => {
    const formData = { productId, quantity };
    const response = await fetch(
      process.env.REACT_APP_HOSTNAME + '/shop/update-qty',
      {
        method: 'PUT',
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

    setLoading(false);
    return navigate('/cart');
  };

  // quantity phải từ 1 trở lên
  let minimum = true;

  if (quantity <= 1) {
    minimum = false;
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
      updateQuantityHandler(productId, quantity - 1); // Gọi API khi số lượng thay đổi
    }
  };

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
    updateQuantityHandler(productId, quantity + 1); // Gọi API khi số lượng thay đổi
  };

  return (
    <>
      {minimum ? (
        <>
          {!loading && !load && (
            <span className={styles.quantity} onClick={handleDecrease}>
              &lt;
            </span>
          )}
        </>
      ) : (
        <span className={`${styles.quantity} ${styles.none}`}>&lt;</span>
      )}
      <span className={`${styles.quantity} ${styles.num}`}> {quantity}</span>
      {!loading && !load && (
        <span className={styles.quantity} onClick={handleIncrease}>
          &gt;
        </span>
      )}
    </>
  );
};

export default Quantity;
