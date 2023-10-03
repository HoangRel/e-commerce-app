import { useState } from 'react';
import { redirect } from 'react-router-dom';
import Banner from '../components/Banner';
import Container from '../components/detailPage/Container';

const DetailPage = () => {
  const [isProduct, setIsProduct] = useState(false);

  return (
    <>
      <Banner
        page='Detail'
        other={isProduct ? null : 'Không có sản phẩm này!'}
      />
      <Container isProduct={isProduct} setIsProduct={setIsProduct} />
    </>
  );
};

export default DetailPage;

export async function loader({ params }) {
  const prodId = await params.productId;

  const response = await fetch(
    process.env.REACT_APP_HOSTNAME + '/shop/product/' + prodId,
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 500) {
      window.alert(data.message);
      return redirect('/');
    } else {
      return null;
    }
  }

  return data;
}
