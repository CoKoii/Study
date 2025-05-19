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
    addCount: (state, action) => {
      console.log(state);
      console.log(action);

      state.count += action.payload;
    },
  },
});

const { increament, decreament, addCount } = counterStore.actions;
const reducer = counterStore.reducer;
export { increament, decreament, addCount };
export default reducer;
