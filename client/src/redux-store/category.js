import { createSlice } from '@reduxjs/toolkit';

const initialCategoryState = { data: [] };

const categorySlice = createSlice({
  name: 'category',
  initialState: initialCategoryState,
  reducers: {
    switchCatogory(state, action) {
      state.data = action.payload;
    },
  },
});

export const categoryActions = categorySlice.actions;

export default categorySlice.reducer;
