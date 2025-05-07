import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
]);
export default router;
