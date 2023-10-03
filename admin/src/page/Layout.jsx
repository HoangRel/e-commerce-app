import { useEffect, useContext } from 'react';
import { useNavigate, Outlet, Link, useSubmit } from 'react-router-dom';
import AuthContext from '../context/auth';

const Layout = () => {
  const submit = useSubmit();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx.isLogged) {
      return navigate('/login');
    }
  }, [authCtx.isLogged, navigate, authCtx]);

  const logoutHandler = () => {
    submit(null, { action: '/logout', method: 'POST' });
    authCtx.onLogout();
  };

  return (
    <section>
      {authCtx.role === 'ADMIN' && (
        <div className='DasSec'>
          <h3>Admin Page</h3>
          {authCtx.name && (
            <div className='hiname div2'>
              <p>hi, {authCtx.name}.</p>
            </div>
          )}
          <div className='div3'>
            <nav>
              <Link to='/admin'>
                <p>Dashboard</p>
              </Link>
            </nav>
            <nav>
              <p>COMPONENTS</p>
              <Link to='/admin/products'>
                <p>Products</p>
              </Link>
              <Link to='/admin/post-product'>
                <p>New Product</p>
              </Link>
              <nav>
                <p>LIVE CHAT</p>
                <Link to='/admin/chats'>
                  <p>Chatbox</p>
                </Link>
              </nav>
              <nav>
                <p>User</p>
                <li id='onLogout' onClick={logoutHandler}>
                  <p>Logout</p>
                </li>
              </nav>
            </nav>
          </div>
          <main className='mainDiv'>
            {authCtx.isLogged && authCtx.role === 'ADMIN' && <Outlet />}
          </main>
        </div>
      )}

      {authCtx.role === 'TVV' && (
        <div className='DasSec'>
          <h3>Chat Page</h3>
          {authCtx.name && (
            <div className='hiname div2'>
              <p>hi, {authCtx.name}.</p>
            </div>
          )}
          <div className='div3'>
            <nav>
              <Link to='/admin'>
                <p>Dashboard</p>
              </Link>
            </nav>
            <nav>
              <nav>
                <p>CHATBOX</p>
                <Link to='/admin/chats'>
                  <p>Chatbox</p>
                </Link>
              </nav>
              <nav>
                <p>User</p>
                <li id='onLogout' onClick={logoutHandler}>
                  <p>Logout</p>
                </li>
              </nav>
            </nav>
          </div>
          <main className='mainDiv'>
            {authCtx.isLogged && authCtx.role === 'TVV' && <Outlet />}
          </main>
        </div>
      )}
      {authCtx.role === 'CLIENT' && (
        <nav>
          <p>User</p>
          <li id='onLogout' onClick={logoutHandler}>
            <p>Logout</p>
          </li>
        </nav>
      )}
    </section>
  );
};

export default Layout;
