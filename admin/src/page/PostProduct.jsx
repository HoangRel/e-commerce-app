import React, { useState, useEffect } from 'react';
import {
  Form,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import Card from '../card/Card';

import styles from './PostProduct.module.css';

const PostProduct = () => {
  const [prodId, setProdId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [short, setShort] = useState('');
  const [long, setLong] = useState('');
  const [selectedImg, setSelectedImg] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const edit = searchParams.get('edit');

  const { state } = useLocation();

  useEffect(() => {
    if (edit && state) {
      setProdId(state._id);
      setName(state.name);
      setCategory(state.category);
      setPrice(state.price);
      setShort(state.short_desc);
      setLong(state.long_desc);
      setImageUrl([state.img1, state.img2, state.img3, state.img4]);
      setCount(state.count);
    } else {
      setProdId('');
      setName('');
      setCategory('');
      setPrice('');
      setShort('');
      setLong('');
      setImageUrl([]);
      setCount(0);
    }
  }, [state, edit]);

  const changeImageHandler = event => {
    const selectedImages = event.target.files;

    if (selectedImages.length !== 4) {
      window.alert('Choose 4 images.');
      return;
    }

    setSelectedImg(Array.from(selectedImages));
    const imageUrls = Array.from(selectedImages).map(selectedImage =>
      URL.createObjectURL(selectedImage)
    );

    setImageUrl(imageUrls);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!name || !category || isNaN(price) || !short || !long || isNaN(count)) {
      window.alert('Invalid value');
      return;
    }

    if (!edit && selectedImg.length !== 4) {
      window.alert('Choose 4 images.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedImg.length; i++) {
      formData.append('images', selectedImg[i]);
    }

    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('short_desc', short);
    formData.append('long_desc', long);
    formData.append('count', count);

    if (edit) {
      formData.append('prodId', prodId);
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_HOSTNAME + '/admin/product/' + getTailUrl(),
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      const resData = await response.json();
      if (response.ok) {
        window.alert(resData.message);
        return navigate('/admin/products');
      } else if (response.status === 422 || response.status === 500) {
        throw new Error(resData.message);
      } else {
        throw new Error('Error!');
      }
    } catch (err) {
      window.alert(err.message);
      return;
    }
  };

  const getTailUrl = () => {
    return edit ? 'update' : 'create';
  };

  return (
    <section>
      <div className={styles.title}>
        <Card>
          <p>{!edit ? 'Add New Product' : 'Edit Product'}</p>
        </Card>
      </div>
      <Card>
        <Form
          className={styles.form}
          method='POST'
          encType='multipart/form-data'
          onSubmit={handleSubmit}
        >
          <label htmlFor='name'>
            Product Name
            <input
              type='text'
              id='name'
              required
              value={name}
              onChange={e => setName(e.target.value)}
              name='name'
            />
          </label>
          <label htmlFor='category'>
            Category
            <input
              type='text'
              id='category'
              required
              value={category}
              onChange={e => setCategory(e.target.value)}
              name='category'
            />
          </label>
          <label htmlFor='price'>
            Price
            <input
              type='number'
              id='price'
              required
              value={price}
              onChange={e => setPrice(e.target.value)}
              name='price'
            />
          </label>
          <label htmlFor='short' className={styles.short}>
            Short Description
            <textarea
              type='text'
              id='short'
              value={short}
              onChange={e => setShort(e.target.value)}
              name='short_desc'
            />
          </label>
          <label htmlFor='long' className={styles.long}>
            Long Description
            <textarea
              type='text'
              id='long'
              value={long}
              onChange={e => setLong(e.target.value)}
              name='long_desc'
            />
          </label>
          <label htmlFor='count'>
            Count
            <input
              type='number'
              id='count'
              required
              value={count}
              onChange={e => setCount(e.target.value)}
              name='count'
            />
          </label>
          {!edit && (
            <>
              <label htmlFor='img'>Upload images (4 images)</label>
              <input
                type='file'
                id='img'
                multiple
                accept='image/*'
                name='images'
                onChange={changeImageHandler}
              />
            </>
          )}
          <div className={styles.formImg}>
            {imageUrl.map((url, index) => (
              <img key={index} src={url} alt='' />
            ))}
          </div>

          <button type='submit'>{!edit ? 'Submit' : 'Edit'}</button>
        </Form>
      </Card>
    </section>
  );
};

export default PostProduct;
