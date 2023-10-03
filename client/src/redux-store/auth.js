import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_HOSTNAME + '/check-auth',
        {
          credentials: 'include',
        }
      );
      const data = await response.json();

      if (data.isLoggedIn) {
        dispatch(authActions.ON_LOGIN(data.name));
      } else {
        dispatch(authActions.ON_LOGOUT());
      }
    } catch (err) {
      console.error(err.message);
    }
  }
);

const initialAuthState = {
  currentAcc: '',
  isLogged: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    ON_LOGIN(state, action) {
      state.currentAcc = action.payload;
      state.isLogged = true;
    },

    ON_LOGOUT(state) {
      state.currentAcc = '';
      state.isLogged = false;
    },
  },
});

export const authActions = { ...authSlice.actions, checkAuthAsync };

export default authSlice.reducer;
