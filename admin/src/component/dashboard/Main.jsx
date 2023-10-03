import { useLoaderData } from 'react-router-dom';
import styles from './Main.module.css';
import Info from './Info';
import History from './History';
import { useEffect, useState } from 'react';

const Main = () => {
  const [clients, setClients] = useState(0);
  const [price, setPrice] = useState(0);
  const [counter, setCounter] = useState(0);
  const [historiesData, setHistoriesData] = useState([]);

  const data = useLoaderData();
  useEffect(() => {
    setCounter(data.length);

    if (data) {
      const userIdIds = new Set();
      const userIdData = data.filter(mov => {
        if (!userIdIds.has(mov.userId)) {
          userIdIds.add(mov.userId);
          return true;
        }
        return false;
      });

      const clientCount = userIdData.length;

      setClients(clientCount);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const renderData = [...data].reverse();
      setHistoriesData(renderData);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const total = data.reduce((acc, cur) => {
        return acc + cur.totalPrice;
      }, 0);

      setPrice(total);
    }
  }, [data]);

  return (
    <section className={styles.section}>
      <h1>Dashboard</h1>
      <Info clients={clients} price={price} counter={counter} />
      <History data={historiesData} />
    </section>
  );
};
export default Main;
