import { configureStore } from '@reduxjs/toolkit';

import popupReducer from './popup';
import categoryReducer from './category';
import authReducer from './auth';

const store = configureStore({
  reducer: {
    popup: popupReducer,
    category: categoryReducer,
    auth: authReducer,
  },
});

export default store;
