import { useParams } from "react-router-dom";
import { ROUTES, type PathParams } from "@/shared/model/routes.tsx";
import { rqClient } from "@/shared/api/instance.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function NotePage() {
  const params = useParams<PathParams[typeof ROUTES.NOTE]>();
  const noteId = params.noteId;

  const queryClient = useQueryClient();
  const notesQuery = rqClient.useQuery("get", "/notes");

  const note = notesQuery.data?.find((n) => n.id === noteId);

  const [form, setForm] = useState({
    title: note?.title || "",
    content: note?.content || "",
  });

  const editNoteMutation = rqClient.useMutation("put", "/notes/{noteId}", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
          rqClient.queryOptions("get", "/notes"),
      );
    },
  });

  if (!note) return <div>Note not found</div>;

  return (
      <div>
        <h1>Edit Note</h1>
        <form
            onSubmit={(e) => {
              e.preventDefault();
              editNoteMutation.mutate({
                params: { path: { noteId: noteId! } },
                body: {
                  title: form.title,
                  content: form.content,
                },
              });
            }}
        >
          <input
              name="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
              name="content"
              type="text"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <button type="submit" disabled={editNoteMutation.isPending}>
            Save
          </button>
        </form>
      </div>
  );
}

export const Component = NotePage;
