import styles from './Description.module.css';

const Description = ({ product }) => {
  // chia long_desc ra thành từng item trong array
  const desc = product.long_desc.split(/[-•]/);

  return (
    <section className={styles.section} id='description'>
      <button
        onClick={() => document.getElementById('description').scrollIntoView()}
      >
        DESCRIPTION
      </button>
      <h3>Product description</h3>
      <h5>{desc[0]}</h5>
      <ul>
        {desc.slice(1).map((de, index) => (
          <li key={index}>{`${de}.`}</li>
        ))}
      </ul>
    </section>
  );
};

export default Description;
