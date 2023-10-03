import { useState, useEffect, useContext } from 'react';
import {
  redirect,
  useLoaderData,
  useNavigate,
  useSubmit,
} from 'react-router-dom';

import styles from './Product.module.css';
import AuthContext from '../context/auth';

const Products = () => {
  const prodData = useLoaderData();
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const submit = useSubmit();

  const { role } = useContext(AuthContext);

  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate('/admin/chats');
    }
  }, [role, navigate]);

  useEffect(() => {
    setProducts(prodData);
  }, [prodData]);

  let timeoutId;

  const changInputHandler = event => {
    const searchText = event.target.value;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const products = prodData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setProducts(products);
    }, 500);
  };

  const editHandler = state => {
    navigate('/admin/post-product?edit=true', { state });
  };

  const deleteHandler = prodId => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    submit({ prodId }, { method: 'DELETE' });
  };

  return (
    <>
      {role === 'ADMIN' && (
        <section className={styles.section}>
          <div className={styles.header}>
            <h1>Products</h1>
            <input
              type='text'
              name='text'
              placeholder='Enter Search!'
              onChange={changInputHandler}
            />
          </div>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Category</th>
                <th>Count</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody className={styles.body}>
              {products &&
                products.map(item => {
                  return (
                    <tr key={item._id}>
                      <td>{item._id}</td>
                      <td>{item.name}</td>
                      <td>{item.price.toLocaleString('vi-VI')} VND</td>
                      <td className={styles.img}>
                        <img src={item.img1} alt={item.name} />
                      </td>
                      <td>{item.category}</td>
                      <td>{item.count}</td>
                      <td>
                        <div className={styles.btn}>
                          <button onClick={() => editHandler(item)}>
                            Update
                          </button>
                          <button onClick={deleteHandler.bind(null, item._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};
export default Products;

export const loader = async () => {
  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/admin/products',
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      return window.alert(data.message);
    }
    return [];
  }

  return data;
};

export const action = async ({ request }) => {
  const data = await request.formData();
  const prodId = data.get('prodId');
  console.log(prodId);

  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/admin/product/delete/' + prodId,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  const resData = await response.json();

  if (!response.ok) {
    window.alert(resData.message);
    return null;
  }

  window.alert(resData.message);
  return redirect('/admin/products');
};
