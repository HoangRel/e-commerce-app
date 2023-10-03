import { useLoaderData, useNavigate } from 'react-router-dom';
import styles from './Container.module.css';
import { useEffect, useState } from 'react';

const Container = () => {
  const [data, setData] = useState([]);

  const loaderData = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaderData) {
      const data = [...loaderData].reverse();
      setData(data);
    }
  }, [loaderData]);

  return (
    <section className={styles.hisSec}>
      <table>
        <thead>
          <tr>
            <th>Id order</th>
            <th>Id user</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map(mov => (
              <tr key={mov._id}>
                <td>{mov._id}</td>
                <td>{mov.userId}</td>
                <td>{mov.name}</td>
                <td>{mov.phone}</td>
                <td>{mov.address}</td>
                <td>
                  {Intl.NumberFormat('vi-VI').format(mov.totalPrice)}
                  <br />
                  VND
                </td>
                <td>{mov.delivery}</td>
                <td>{mov.status}</td>
                <td onClick={() => navigate(`${mov._id}`)}>
                  <p>View &#10142;</p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default Container;
