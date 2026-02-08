import { createSlice } from "@reduxjs/toolkit";

interface TextareaState {
  height: number;
}

const initialState: TextareaState = {
  height: 96, // default min height (4 rows * 24px)
};

const textareaSlice = createSlice({
  name: "textarea",
  initialState,
  reducers: {
    setHeight(state, action) {
      state.height = action.payload;
    },
  },
});

export const { setHeight } = textareaSlice.actions;
export default textareaSlice.reducer;
