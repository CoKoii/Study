import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Main from "../Layout/Main";
import Chat from "../Layout/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "chat/:id",
        element: <Chat />,
      },
    ],
  },
]);

export default router;
