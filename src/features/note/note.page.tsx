import { useParams } from "react-router-dom";
import { ROUTES, type PathParams } from "@/shared/model/routes.tsx";
import { rqClient } from "@/shared/api/instance.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { Editor } from "@/shared/ui/editor";
import styles from "./styles.module.scss";

function NotePage() {
  const params = useParams<PathParams[typeof ROUTES.NOTE]>();
  const noteId = params.noteId;

  const queryClient = useQueryClient();
  const notesQuery = rqClient.useQuery("get", "/notes");

  const note = notesQuery.data?.find((n) => n.id === noteId);

  const [content, setContent] = useState(note?.content || "");

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const editNoteMutation = rqClient.useMutation("put", "/notes/{noteId}", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/notes"),
      );
    },
  });

  if (!note) return <div className={styles.notFound}>Note not found</div>;

  // Extract first paragraph as title
  const getTitleFromContent = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const firstParagraph = tempDiv.querySelector("p");
    return firstParagraph?.textContent?.trim() || "Untitled Note";
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Edit Note</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          editNoteMutation.mutate({
            params: { path: { noteId: noteId! } },
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
          disabled={editNoteMutation.isPending}
        >
          Save
        </button>
      </form>
    </div>
  );
}

export const Component = NotePage;
