import { redirect } from 'react-router-dom';

export async function action() {
  const res = await fetch(process.env.REACT_APP_HOSTNAME + '/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  window.alert(data.message);

  return redirect('/');
}
