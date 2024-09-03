import { createBrowserRouter } from "react-router-dom";
import Chat from "../pages/chat/Chat";
import Auth from "../pages/auth/Auth";
import Protected from "./Protected";
import CheckIsLogin from "./CheckIsLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckIsLogin>
        <Auth />
      </CheckIsLogin>
    ),
  },
  {
    path: "/chat",
    element: (
      <Protected>
        <Chat />
      </Protected>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

export default router;
