import { useState } from "react";
import { GiftIcon } from "../../icons/icons";

import styles from "./Total.module.css";

const Total = ({ totalPrice }) => {
  const [value, setValue] = useState("");
  const [plah, setPlah] = useState("Enter your coupon");

  //
  const clickHandler = () => {
    setValue("");
    setPlah("Coupon không hợp lệ!");
    setTimeout(() => {
      setPlah("Enter your coupon");
    }, 1000);
  };

  return (
    <div className={styles.total}>
      <h2>Cart total</h2>
      <div className={styles.sub}>
        <h4>Subtotal</h4>
        <p>{Intl.NumberFormat("vi-VI").format(totalPrice)}&nbsp;VND</p>
      </div>
      <div className={styles.price}>
        <h4>Total</h4>
        <p>{Intl.NumberFormat("vi-VI").format(totalPrice)}&nbsp;VND</p>
      </div>
      <input
        placeholder={plah}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button onClick={clickHandler}>
        <i>
          <GiftIcon />
        </i>
        &nbsp;&nbsp;Apply coupon
      </button>
    </div>
  );
};

export default Total;
