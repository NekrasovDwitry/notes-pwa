import { rqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useEditNote(noteId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editNoteMutation = rqClient.useMutation("put", "/notes/{noteId}", {
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes/{noteId}", {
          params: { path: { noteId } },
        }),
      );
      navigate(ROUTES.NOTES);
    },
  });

  return {
    isPending: editNoteMutation.isPending,
    editNote: (content: string) =>
      editNoteMutation.mutate({
        params: { path: { noteId } },
        body: { content },
      }),
  };
}
