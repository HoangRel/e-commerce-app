import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Description from './container/Description';
import DetailProduct from './container/DetailProduct';
import ProductItem from '../ProductItem';

import styles from './Container.module.css';

const Container = ({ isProduct, setIsProduct }) => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);

  const data = useLoaderData();

  useEffect(() => {
    if (data) {
      setIsProduct(true);
      setProduct(data.product);

      setRelatedProducts(data.relatedProducts);
    }
  }, [data, setIsProduct]);

  //
  const clickHandler = product => {
    navigate(`/detail/${product._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {isProduct && (
        <>
          <DetailProduct product={product} />
          <Description product={product} />
          <section>
            <h3>Related Products</h3>
            {relatedProducts.length !== 0 ? (
              <div className={styles.relatedProducts}>
                {relatedProducts.map(product => (
                  <ProductItem
                    key={product._id}
                    product={product}
                    onClick={() => clickHandler(product)}
                  />
                ))}
              </div>
            ) : (
              <p className='message'>Không còn nữa!</p>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default Container;
