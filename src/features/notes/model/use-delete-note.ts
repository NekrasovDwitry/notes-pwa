import { rqClient } from "@/shared/api/instance";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const deleteNoteMutation = rqClient.useMutation("delete", "/notes/{noteId}", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
    },
  });

  return {
    deleteNote: (noteId: string) =>
      deleteNoteMutation.mutate({
        params: { path: { noteId } },
      }),
    getIsPending: (noteId: string) =>
      deleteNoteMutation.isPending &&
      deleteNoteMutation.variables?.params?.path?.noteId === noteId,
  };
}
