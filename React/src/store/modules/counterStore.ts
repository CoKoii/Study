import { createSlice } from "@reduxjs/toolkit";

const counterStore = createSlice({
  name: "counterStore",
  initialState: {
    count: 11110,
  },
  reducers: {
    increament: (state) => {
      state.count++;
    },
    decreament: (state) => {
      state.count--;
    },
  },
});

const { increament, decreament } = counterStore.actions;
const reducer = counterStore.reducer;
export { increament, decreament };
export default reducer;
