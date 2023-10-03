import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthAsync } from '../../redux-store/auth';
import { useDispatch } from 'react-redux';

const usePostAuth = () => {
  const [resData, setResData] = useState('');
  const [error, setError] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAPI = async (formData, query) => {
    setError([]);
    const response = await fetch(
      process.env.REACT_APP_HOSTNAME + '/auth/' + query,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 500 || response.status === 401) {
        window.alert(data.message);
        return navigate('/');
      } else {
        setError(data);
        return;
      }
    }

    setResData(data);
    window.alert('Succeeded!');
    return dispatch(checkAuthAsync());
  };

  const runFetchAPI = (formData, query) => {
    fetchAPI(formData, query);
  };

  return {
    runFetchAPI,
    resData,
    error,
  };
};

export default usePostAuth;
