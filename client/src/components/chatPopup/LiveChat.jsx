import { useEffect, useRef } from 'react';
import styles from './ChatPopup.module.css';

const LiveChat = ({ messages }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.center}>
      {messages.map((msg, index) => (
        <div key={index} className={msg.isClient ? styles.to : styles.from}>
          <p ref={scrollRef}>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default LiveChat;
