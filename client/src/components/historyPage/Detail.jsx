import { redirect, useLoaderData } from 'react-router-dom';

import styles from './Detail.module.css';

const Detail = () => {
  const data = useLoaderData();

  return (
    <section>
      {data && (
        <>
          <div className={styles.info}>
            <h1>INFORMATION ORDER</h1>
            <p>ID User: {data._id}</p>
            <p>Full Name: {data.name}</p>
            <p>Phone: {data.phone}</p>
            <p>Address: {data.address}</p>
            <p>
              Total: {Intl.NumberFormat('vi-Vi').format(data.totalPrice)} VND
            </p>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Id Product</th>
                <th>Image</th>
                <th>name</th>
                <th>price</th>
                <th>count</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map(mov => (
                <tr key={mov._id}>
                  <td>{mov.product._id}</td>
                  <td className={styles.img}>
                    <img src={mov.product.img} alt={mov.name} />
                  </td>
                  <td>{mov.product.name}</td>
                  <td>
                    {Intl.NumberFormat('vi-VI').format(mov.product.price)} VND
                  </td>
                  <td>{mov.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
};

export default Detail;

export async function loader({ params }) {
  const orderId = await params.orderId;

  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/shop/order/' + orderId,
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    window.alert(data.message);
    if (response.status === 500) {
      return redirect('/');
    }
    return redirect('/history');
  }

  return data;
}
