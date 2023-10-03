import { Link } from "react-router-dom";

import productImg_1 from "../../images/product_1.png";
import productImg_2 from "../../images/product_2.png";
import productImg_3 from "../../images/product_3.png";
import productImg_4 from "../../images/product_4.png";
import productImg_5 from "../../images/product_5.png";

import styles from "./Category.module.css";

const Category = () => {
  return (
    <section className={styles.section}>
      <p>Carefully created collections</p>
      <h3>Browser our categoories</h3>

      <Link to="/shop" className={styles.category}>
        <div>
          <img src={productImg_1} alt="iphone" />
          <img src={productImg_2} alt="mac" />
        </div>
        <div>
          <img src={productImg_3} alt="ipad" />
          <img src={productImg_4} alt="watch" />
          <img src={productImg_5} alt="airpods" />
        </div>
      </Link>
    </section>
  );
};

export default Category;
