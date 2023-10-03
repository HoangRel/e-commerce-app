import {
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useParams,
} from 'react-router-dom';

import adminImg from '../image/admin.png';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from '../component/Chats.module.css';

const socket = io.connect(process.env.REACT_APP_HOSTNAME);

const Chats = () => {
  const [resRooms, setResRooms] = useState([]);
  const [rooms, setRooms] = useState([]);

  const data = useLoaderData();

  const { currentRoomId } = useParams();

  useEffect(() => {
    if (data) {
      setResRooms(data);
    }
  }, [data]);

  useEffect(() => {
    if (resRooms) {
      const reversedData = [...resRooms].reverse();
      setRooms(reversedData);
    }
  }, [resRooms]);

  useEffect(() => {
    socket.on('send_message', ({ roomId, message }) => {
      if (currentRoomId !== roomId) {
        const roomIndex = resRooms.findIndex(room => room._id === roomId);

        if (roomIndex === -1) {
          const updatedRooms = [
            ...resRooms,
            { _id: roomId, messages: [message] },
          ];
          setResRooms(updatedRooms);
        } else {
          const updatedRooms = [...resRooms];
          updatedRooms[roomIndex].messages.push(message);

          setResRooms(updatedRooms);
        }
      }
    });

    return () => {
      socket.off('send_message');
    };
  }, [currentRoomId, rooms, resRooms]);

  return (
    <section className={styles.section}>
      <h3>Chat</h3>
      <p>Apps / Chat</p>
      <div>
        <div>
          <div className={styles.input}>
            <input placeholder='Search Contact' />
          </div>
          <article className={styles.idChat}>
            {rooms &&
              rooms.map(mov => (
                <div key={mov._id}>
                  <NavLink
                    to={`/admin/chats/${mov._id}`}
                    className={({ isActive }) =>
                      isActive ? styles.active : null
                    }
                  >
                    <img src={adminImg} alt='' />
                    {mov._id}
                  </NavLink>
                </div>
              ))}
          </article>
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default Chats;

export async function loader() {
  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/admin/chat-rooms',
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
    return [];
  }

  return data;
}
