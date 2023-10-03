import React from 'react';

import Banner from '../components/Banner';
import Container from '../components/historyPage/Container';
import { redirect } from 'react-router-dom';

const HistoryPage = () => {
  return (
    <>
      <Banner page='history' />
      <Container />
    </>
  );
};

export default HistoryPage;

export async function loader() {
  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/shop/orders',
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    window.alert(data.message);
    return redirect('/');
  }

  return data;
}
