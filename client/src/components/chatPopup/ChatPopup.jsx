import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { MessageIcon, LinkIcon, IconsIcon, SendIcon } from '../../icons/icons';

import admin from '../../images/admin.png';

import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import LiveChat from './LiveChat';

import styles from './ChatPopup.module.css';

const socket = io.connect(process.env.REACT_APP_HOSTNAME);

const ChatPopup = () => {
  const [toggle, setToggle] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const [chat, setChat] = useState([]);

  const navigate = useNavigate();

  const roomId = localStorage.getItem('roomId') || null;

  useEffect(() => {
    socket.emit('join_room', roomId);

    // Đăng ký event listener khi component được mount
    socket.on('receive_message', ({ roomId, message }) => {
      if (roomId === localStorage.getItem('roomId')) {
        setChat(prevChat => [...prevChat, message]);
      }
    });

    // Hủy đăng ký event listener khi component bị unmounted hoặc khi roomId thay đổi
    return () => {
      socket.off('receive_message');
    };
  }, [roomId]);

  /////////

  const postMessage = async input => {
    const roomId = localStorage.getItem('roomId') || null;

    const response = await fetch(
      process.env.REACT_APP_HOSTNAME + '/chat/message',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, roomId }),
        credentials: 'include',
      }
    );

    const data = await response.json();

    setSending(false);

    if (!response.ok) {
      window.alert(data.message);
      if (response.status === 500) {
        return navigate('/');
      }
      return null;
    }

    setInputText('');
    setChat(pre => [...pre, { text: input, isClient: true }]);

    localStorage.setItem('roomId', data.roomId);

    return null;
  };

  const sendMessHandler = event => {
    event.preventDefault();

    if (inputText.trim() === '') {
      return;
    }

    setSending(true);

    postMessage(inputText);
    console.log(inputText);
  };

  return (
    <>
      <i className={styles.icon} onClick={() => setToggle(pre => !pre)}>
        <MessageIcon />
      </i>
      {toggle && (
        <>
          {createPortal(
            <section className={styles.section}>
              <div className={styles.start}>
                <h4>Customer Support</h4>
                <button>Let's Chat App</button>
              </div>
              <div>{setChat.length > 0 && <LiveChat messages={chat} />}</div>
              <form className={styles.end} onSubmit={sendMessHandler}>
                <img src={admin} alt='admin' />

                <input
                  placeholder='Enter Message!'
                  value={inputText}
                  onChange={e => {
                    if (e.target.value === '/end') {
                      socket.emit('request_disconnect');
                      localStorage.removeItem('roomId');
                      setChat([]);
                      return setInputText('');
                    }
                    setInputText(e.target.value);
                  }}
                />
                <i>
                  <LinkIcon />
                </i>
                <i>
                  <IconsIcon />
                </i>
                {!sending && (
                  <button type='submit'>
                    <i>
                      <SendIcon />
                    </i>
                  </button>
                )}
              </form>
              <p className={styles.endChat}>"/end" to end.</p>
            </section>,
            document.getElementById('chat-popup')
          )}
        </>
      )}
    </>
  );
};

export default ChatPopup;
