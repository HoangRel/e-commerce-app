import styles from "./Others.module.css";

const Others = () => {
  return (
    <>
      <section className={styles.intro}>
        <div>
          <h4>Free shipping</h4>
          <p>Free shipping worldwide</p>
        </div>
        <div>
          <h4>24 X 7 service</h4>
          <p>Free shipping worldwide</p>
        </div>
        <div>
          <h4>Festival offer</h4>
          <p>Free shipping worldwide</p>
        </div>
      </section>
      <section className={styles.partici}>
        <div>
          <h3>Let's to friend!</h3>
          <p>Nisi nisi tempor consequat laboris nisi.</p>
        </div>

        {/* Boostrap */}

        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email address"
            style={{ borderRadius: 0 }}
          />
          <button
            className="btn btn-dark px-5"
            type="button"
            style={{
              borderRadius: 0,
              backgroundColor: "var(--color-primary)",
              color: "var(--color-gray)",
            }}
          >
            Subscribe
          </button>
        </div>
      </section>
    </>
  );
};

export default Others;
