import { rqClient } from "@/shared/api/instance";

export function useGetNote(noteId: string) {
  const { data: note, ...queryResult } = rqClient.useQuery(
    "get",
    "/notes/{noteId}",
    {
      params: {
        path: { noteId },
      },
    },
  );

  return {
    note,
    ...queryResult,
  };
}
