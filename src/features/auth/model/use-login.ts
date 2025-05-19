import { publicRqClient } from "@/shared/api/instance";
import type { ApiSchemas } from "@/shared/api/schema";
import { ROUTES } from "@/shared/model/routes";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "@/shared/model/session.ts";

export function useLogin() {
  const navigate = useNavigate();

  const loginMutation = publicRqClient.useMutation("post", "/auth/login", {
    onSuccess(data) {
      const token = data?.accessToken;

      if (token) {
        sessionStore.login(token);
        navigate(ROUTES.HOME);
      } else {
        console.error("Token not found");
      }
    },
  });

  const login = (data: ApiSchemas["LoginRequest"]) => {
    loginMutation.mutate({ body: data });
  };

  const errorMessage = loginMutation.isError
    ? loginMutation.error.message
    : undefined;

  return {
    login,
    isPending: loginMutation.isPending,
    errorMessage,
  };
}
