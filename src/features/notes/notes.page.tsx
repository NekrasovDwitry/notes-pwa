import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes.tsx";
import { rqClient } from "@/shared/api/instance.ts";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./styles.module.scss";

function NotesPage() {
  const queryClient = useQueryClient();
  const notesQuery = rqClient.useQuery("get", "/notes");

  const createNoteMutation = rqClient.useMutation("post", "/notes", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
    },
  });

  const deleteNoteMutation = rqClient.useMutation("delete", "/notes/{noteId}", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
    },
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Notes</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          createNoteMutation.mutate({
            body: {
              title: formData.get("title") as string,
              content: formData.get("content") as string,
            },
          });
          e.currentTarget.reset(); // clear form after submit
        }}
      >
        <input
          name="title"
          type="text"
          placeholder="Title"
          className={styles.input}
        />
        <input
          name="content"
          type="text"
          placeholder="Content"
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={createNoteMutation.isPending}
        >
          Create note
        </button>
      </form>

      {notesQuery.data?.map((note) => (
        <div className={styles.note} key={note.id}>
          <Link to={href(ROUTES.NOTE, { noteId: note.id })}>{note.title}</Link>
          <button
            className={styles.button}
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
