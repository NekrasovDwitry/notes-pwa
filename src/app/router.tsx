import { ROUTES } from "@/shared/model/routes";
import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App.tsx";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTES.NOTES,
        lazy: () => import("@/features/notes/notes.page"),
      },
      {
        path: ROUTES.NOTE,
        lazy: () => import("@/features/note/note.page"),
      },
      {
        path: ROUTES.LOGIN,
        lazy: () => import("@/features/auth/login.page"),
      },
      {
        path: ROUTES.REGISTER,
        lazy: () => import("@/features/auth/register.page"),
      },
      {
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.NOTES),
      },
    ],
  },
]);
