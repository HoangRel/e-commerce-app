import { Link } from 'react-router-dom';
import styles from './History.module.css';
const History = ({ data }) => {
  return (
    <div className={styles.container}>
      <h2>History</h2>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>ID User</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data &&
            data.map(mov => {
              return (
                <tr key={mov._id}>
                  <td>{mov.userId}</td>
                  <td>{mov.name}</td>
                  <td>{mov.phone}</td>
                  <td>{mov.address}</td>
                  <td>{Intl.NumberFormat('vi-Vi').format(mov.totalPrice)}</td>
                  <td>{mov.delivery}</td>
                  <td>{mov.status}</td>
                  <td className={styles.view}>
                    <Link>View</Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default History;
