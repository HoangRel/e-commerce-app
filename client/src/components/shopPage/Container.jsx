import Categories from "./container/Categories";
import ProductList from "./container/ProductList";

import styles from "./Container.module.css";

const Container = () => {
  return (
    <section className={styles.container}>
      <Categories />
      <ProductList />
    </section>
  );
};

export default Container;
