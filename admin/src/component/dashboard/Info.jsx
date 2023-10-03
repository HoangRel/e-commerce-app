import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';

import styles from './Info.module.css';

const Info = ({ clients, price, counter }) => {
  return (
    <header className={styles.infoHeader}>
      <div className={styles.card}>
        <div className={styles.content}>
          <h1>{clients}</h1>
          <p>Clients</p>
        </div>
        <div className={styles.icon}>
          <PersonAddAltOutlinedIcon />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <h1>
            {Intl.NumberFormat('vi-Vi').format(price)}
            <span>VND</span>
          </h1>
          <p>Earnings of Month</p>
        </div>
        <div className={styles.icon}>
          <AttachMoneyIcon />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <h1>{counter}</h1>
          <p>New Order</p>
        </div>
        <div className={styles.icon}>
          <NoteAddOutlinedIcon />
        </div>
      </div>
    </header>
  );
};
export default Info;
