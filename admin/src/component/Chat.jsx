import { useEffect, useRef, useState } from 'react';
import { Form, redirect, useLoaderData, useNavigation } from 'react-router-dom';

import { io } from 'socket.io-client';

import styles from './Chats.module.css';

import { SendIcon } from '../icons/icons';

const socket = io.connect(process.env.REACT_APP_HOSTNAME);

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [chat, setChat] = useState([]);
  const [isEnd, setIsEnd] = useState(false);

  const { messages, _id, ended } = useLoaderData();
  const navigation = useNavigation();

  useEffect(() => {
    if (messages) {
      setChat(messages);
    }

    setInputText('');

    setIsEnd(ended);
  }, [messages, ended]);

  const scrollRef = useRef();

  const sending = navigation.state === 'submitting';

  useEffect(() => {
    socket.on('send_message', ({ roomId, message }) => {
      if (roomId === _id) {
        setChat(prevChat => [...prevChat, message]);
      }
    });

    socket.on('chat_ended', ({ roomId }) => {
      if (roomId === _id) {
        setIsEnd(true);
      }
    });

    return () => {
      socket.off('send_message');
      socket.off('chat-ended');
    };
  }, [_id]);

  useEffect(() => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        {chat &&
          chat.map((msg, index) => (
            <div key={index} className={msg.isClient ? styles.from : styles.to}>
              <p ref={scrollRef}>{msg.text}</p>
            </div>
          ))}
      </div>
      {isEnd ? (
        <div className={styles.endDiv}>
          <p className={styles.end}>Ended !</p>
        </div>
      ) : (
        <Form className={styles.end} method='POST'>
          <input
            placeholder='Type and Enter!'
            name='message'
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
            }}
          />
          {!sending && (
            <button type='submit'>
              <i>
                <SendIcon />
              </i>
            </button>
          )}
        </Form>
      )}
    </main>
  );
};

export default Chat;

export async function loader({ params }) {
  const roomId = await params.roomId;

  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/admin/chat-room/' + roomId,
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      window.alert(data.message);
      return redirect('/');
    }
    return redirect('/admin/chats');
  }

  return data;
}

export const action = async ({ request, params }) => {
  const inputValue = await request.formData();
  const data = {
    text: inputValue.get('message'),
    roomId: await params.roomId,
  };

  if (data.text.trim() === '') {
    return null;
  }

  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/admin/reply',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    }
  );

  const resData = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      window.alert(resData.message);
      return redirect('/');
    }
    return redirect('/admin/chats');
  }

  return null;
};
