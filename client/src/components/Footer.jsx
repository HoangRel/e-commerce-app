import { Link } from "react-router-dom";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer>
      <nav className={styles.footer}>
        <div className={styles.nav}>
          <h3>CUSTOMER SERVICES</h3>
          <ul>
            <li>
              <Link to="#">Help & Contact Us</Link>
            </li>
            <li>
              <Link to="#">Returns & Refunds</Link>
            </li>
            <li>
              <Link to="#">Online Stores</Link>
            </li>
            <li>
              <Link to="#">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
        <div className={styles.nav}>
          <h3>COMPANY</h3>
          <ul>
            <li>
              <Link to="#">What We Do</Link>
            </li>
            <li>
              <Link to="#">Available Services</Link>
            </li>
            <li>
              <Link to="#">Lastest Posts</Link>
            </li>
            <li>
              <Link to="#">FAQs</Link>
            </li>
          </ul>
        </div>
        <div className={styles.nav}>
          <h3>SOCIAL MEDIA</h3>
          <ul>
            <li>
              <Link to="#">Twitter</Link>
            </li>
            <li>
              <Link to="#">Instagram</Link>
            </li>
            <li>
              <Link to="#">Facebook</Link>
            </li>
            <li>
              <Link to="#">Pinterest</Link>
            </li>
          </ul>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
