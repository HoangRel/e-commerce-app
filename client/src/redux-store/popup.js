import { createSlice } from '@reduxjs/toolkit';

const initialPopupState = { data: null, isShowPopup: false };

const popupSlice = createSlice({
  name: 'popup',
  initialState: initialPopupState,
  reducers: {
    SHOW_POPUP(state, action) {
      state.data = action.payload;
      state.isShowPopup = true;
    },

    HIDE_POPUP(state) {
      state.isShowPopup = false;
    },
  },
});

export const popupActions = popupSlice.actions;

export default popupSlice.reducer;
