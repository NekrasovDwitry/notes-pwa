import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes.tsx";
import { rqClient } from "@/shared/api/instance.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { Editor } from "@/shared/ui/editor";
import styles from "./styles.module.scss";

function NotesPage() {
  const queryClient = useQueryClient();
  const notesQuery = rqClient.useQuery("get", "/notes");

  const [content, setContent] = useState("");

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const createNoteMutation = rqClient.useMutation("post", "/notes", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
      setContent("");
    },
  });

  const deleteNoteMutation = rqClient.useMutation("delete", "/notes/{noteId}", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
    },
  });

  // Extract first paragraph as title
  const getTitleFromContent = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const firstParagraph = tempDiv.querySelector("p");
    return firstParagraph?.textContent?.trim() || "Untitled Note";
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Notes</h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          createNoteMutation.mutate({
            body: {
              title: getTitleFromContent(content),
              content: content,
            },
          });
        }}
      >
        <Editor content={content} onChange={handleContentChange} />
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
