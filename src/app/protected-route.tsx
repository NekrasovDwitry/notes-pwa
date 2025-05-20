import { Navigate, Outlet, redirect } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes.tsx";
import { observer } from "mobx-react-lite";
import { sessionStore } from "@/shared/model/session.ts";
import { enableMocking } from "@/shared/api/mocks";

export const protectedLoader = async () => {
  await enableMocking();

  const token = await sessionStore.refreshToken();

  if (!token) {
    sessionStore.logout();
    return redirect(ROUTES.LOGIN);
  }

  return null;
};

export const ProtectedRoute = observer(() => {
  if (!sessionStore.session) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
});
