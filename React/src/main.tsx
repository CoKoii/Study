import { createRoot } from "react-dom/client";
import router from "./router";
import "@/styles/theme.css";
import store from "./store";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
