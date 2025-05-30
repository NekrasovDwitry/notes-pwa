import { rqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
import { useQueryClient } from "@tanstack/react-query";
import { href, useNavigate } from "react-router-dom";

export function useCreateNote() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createNoteMutation = rqClient.useMutation("post", "/notes", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
    },
    onSuccess: (data) => {
      navigate(href(ROUTES.NOTE, { noteId: data.id }));
    },
  });

  return {
    isPending: createNoteMutation.isPending,
    createNote: () => createNoteMutation.mutate({}),
  };
}
