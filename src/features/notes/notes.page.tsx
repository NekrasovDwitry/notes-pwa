import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes.tsx";
import { rqClient } from "@/shared/api/instance.ts";
import {useQueryClient} from "@tanstack/react-query";

function NotesPage() {
  const queryClient = useQueryClient();
  const notesQuery = rqClient.useQuery("get", "/notes");

  const createNoteMutation = rqClient.useMutation("post", "/notes", {
      onSettled: async () => {
          await queryClient.invalidateQueries(
              rqClient.queryOptions("get", "/notes"),
          )
      }
  });

  const deleteNoteMutation = rqClient.useMutation("delete", "/notes/{noteId}", {
      onSettled: async () => {
          await queryClient.invalidateQueries(
              rqClient.queryOptions("get", "/notes"),
          )
      }
  });

  return (
    <div>
      <h1>Notes</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.target as HTMLFormElement);

          createNoteMutation.mutate({
            body: { title: formData.get("title") as string, content: formData.get("content") as string },
          });
        }}
      >
        <input name="title" type="text" />
        <input name="content" type="text" />
        <button type="submit" disabled={createNoteMutation.isPending}>Create note</button>
      </form>

      {notesQuery.data?.map((note) => (
        <div key={note.id}>
          <Link to={href(ROUTES.NOTE, { noteId: note.id })}>{note.title}</Link>
          <button
            disabled={deleteNoteMutation.isPending}
            onClick={() =>
              deleteNoteMutation.mutate({
                params: { path: { noteId: note.id } },
              })
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export const Component = NotesPage;
