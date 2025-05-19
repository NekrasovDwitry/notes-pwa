import { publicRqClient } from "@/shared/api/instance";
import type { ApiSchemas } from "@/shared/api/schema";
import { ROUTES } from "@/shared/model/routes";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "@/shared/model/session.ts";

export function useRegister() {
  const navigate = useNavigate();

  const registerMutation = publicRqClient.useMutation(
    "post",
    "/auth/register",
    {
      onSuccess(data) {
        const token = data?.accessToken;

        if (token) {
          sessionStore.login(token);
          navigate(ROUTES.HOME);
        } else {
          console.error("Token not found");
        }
      },
    },
  );

  const register = (data: ApiSchemas["RegisterRequest"]) => {
    registerMutation.mutate({ body: data });
  };

  const errorMessage = registerMutation.isError
    ? registerMutation.error.message
    : undefined;

  return {
    register,
    isPending: registerMutation.isPending,
    errorMessage,
  };
}
