import { Link } from "react-router-dom";
import styles from "./Banner.module.css";

const Banner = ({ page, other, navi = false, obj }) => {
  return (
    <section className={styles.banner}>
      <h1>{page}</h1>
      {!navi ? (
        <p>{other ? other : page}</p>
      ) : (
        <div>
          <Link to="/">{obj.home}</Link>
          <Link to="/cart">{obj.cart}</Link>
          <Link to="/checkout">{other}</Link>
        </div>
      )}
    </section>
  );
};

export default Banner;
