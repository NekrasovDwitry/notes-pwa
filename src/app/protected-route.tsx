import { Navigate, Outlet, redirect } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes.tsx";
import { observer } from "mobx-react-lite";
import { sessionStore } from "@/shared/model/session.ts";
import { enableMocking } from "@/shared/api/mocks";

export const protectedLoader = async () => {
  await enableMocking();

  // Try to refresh token if online
  if (navigator.onLine) {
    const token = await sessionStore.refreshToken();
    if (!token) {
      sessionStore.logout();
      return redirect(ROUTES.LOGIN);
    }
  } else {
    // If offline, check if session is valid for offline use
    if (!sessionStore.isSessionValidForOffline()) {
      sessionStore.logout();
      return redirect(ROUTES.LOGIN);
    }
  }

  return null;
};

export const ProtectedRoute = observer(() => {
  // Check both online and offline session validity
  if (
    !sessionStore.session ||
    (!navigator.onLine && !sessionStore.isSessionValidForOffline())
  ) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
});
