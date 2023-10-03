import { useNavigate } from "react-router-dom";

import bannerImg from "../../images/banner1.jpg";

import styles from "./BannerHome.module.css";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.banner}>
      <img src={bannerImg} alt="banner" />
      <div>
        <p>New inspiration 2020</p>
        <h1>20% off on new season</h1>
        <button onClick={() => navigate("/shop")}>Browser collections</button>
      </div>
    </section>
  );
};

export default Banner;
