import { useContext } from 'react';
import Main from '../component/dashboard/Main';
import AuthContext from '../context/auth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const authCtx = useContext(AuthContext);

  return (
    <>
      {authCtx.role === 'ADMIN' ? (
        <Main />
      ) : (
        <Link
          to='/admin/chats'
          style={{
            display: 'inline-block',
            marginTop: '112px',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: '2rem',
          }}
        >
          &#8678;_go to Live Chat room
        </Link>
      )}
    </>
  );
};

export default Dashboard;

export const loader = async () => {
  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/admin/histories',
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      return window.alert(data.message);
    }
    return [];
  }

  return data;
};
