import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import Dashboard, { loader as dashboardLoader } from './page/Dashboard';
import Layout from './page/Layout';
import Login from './page/Login';
import AuthProvider from './context/AuthProvider';

import Products, {
  loader as productsLoader,
  action as productsAction,
} from './page/Products';
import Chats, { loader as chatsLoader } from './page/Chats';
import Chat, {
  loader as chatLoader,
  action as chatAction,
} from './component/Chat';

import { action as logoutAction } from './component/Logout';
import PostProduct from './page/PostProduct';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='login' />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  { path: 'logout', action: logoutAction },
  {
    path: 'admin',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      {
        path: 'products',
        element: <Products />,
        loader: productsLoader,
        action: productsAction,
      },
      {
        path: 'post-product',
        element: <PostProduct />,
      },
      {
        path: 'chats',
        element: <Chats />,
        loader: chatsLoader,
        children: [
          {
            path: ':roomId',
            element: <Chat />,
            loader: chatLoader,
            action: chatAction,
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to='login' /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
