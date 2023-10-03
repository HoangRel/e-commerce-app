import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ProductItem from '../../ProductItem';

import styles from './ProductList.module.css';

const ProductList = () => {
  const navigate = useNavigate();

  const category = useSelector(state => state.category.data);

  const clickHandler = product => {
    navigate(`/detail/${product._id}`);
  };

  return (
    <div className={styles.formList}>
      <div>
        <input placeholder='   Enter Search Here!'></input>
        <select name='sort'>
          <option value='Default Sorting'>Default Sorting</option>
          <option value='Price High to Low'>Price High to Low</option>
          <option value='Price Low to High'>Price Low to High</option>
        </select>
      </div>
      <div className={styles.products}>
        {category.length !== 0 ? (
          category.map(product => (
            <ProductItem
              product={product}
              key={product._id}
              onClick={() => clickHandler(product)}
            />
          ))
        ) : (
          <p className='message'>Không tìm thấy sản phẩm</p>
        )}
      </div>
      <div className={styles.pageNum}>
        <button>«</button>
        <span>1</span>
        <button>»</button>
        <p>{`Showing 1 of 1 results`}</p>
      </div>
    </div>
  );
};

export default ProductList;
