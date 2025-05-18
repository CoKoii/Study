import { configureStore } from "@reduxjs/toolkit";
import reducer from "./modules/counterStore";

const store = configureStore({
  reducer: {
    counter: reducer,
  },
});
export default store;
