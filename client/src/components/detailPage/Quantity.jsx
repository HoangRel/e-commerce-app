import { useState, useEffect } from 'react';
import styles from '../../components/Quantity.module.css';

// component số lượng muốn add
const Quantity = ({ changeQuantityHander, initialQuantity }) => {
  const [quantity, setQuantity] = useState(Number(initialQuantity));

  // quantity phải từ 1 trở lên
  let minimum = true;

  if (quantity <= 1) {
    minimum = false;
  }

  useEffect(() => {
    changeQuantityHander(quantity);
  }, [quantity, changeQuantityHander]);

  return (
    <>
      {minimum ? (
        <span
          className={styles.quantity}
          onClick={() => setQuantity(cur => cur - 1)}
        >
          &lt;
        </span>
      ) : (
        <span className={`${styles.quantity} ${styles.none}`}>&lt;</span>
      )}
      <span className={`${styles.quantity} ${styles.num}`}> {quantity}</span>
      <span
        className={styles.quantity}
        onClick={() => setQuantity(cur => cur + 1)}
      >
        &gt;
      </span>
    </>
  );
};

export default Quantity;
