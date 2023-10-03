import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './pages/Layout';
import HomePage, { loader as productsLoader } from './pages/Home';
import ShopPage from './pages/Shop';
import DetailPage, { loader as detailLoader } from './pages/Detail';
import CartPage, { loader as cartLoader } from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { action as logoutAction } from './pages/Logout';
import HistoryPage, { loader as historyLoader } from './pages/History';
import Detail, { loader as orderLoader } from './components/historyPage/Detail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    loader: productsLoader,
    id: 'layout',
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      {
        path: 'detail/:productId',
        element: <DetailPage />,
        loader: detailLoader,
      },
      { path: 'cart', element: <CartPage />, loader: cartLoader },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'logout', action: logoutAction },
      {
        path: 'history',
        element: <HistoryPage />,
        loader: historyLoader,
      },
      { path: 'history/:orderId', element: <Detail />, loader: orderLoader },

      // * => HomePage
      { path: '*', element: <HomePage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
