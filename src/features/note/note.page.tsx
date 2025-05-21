import { useParams } from "react-router-dom";
import { ROUTES, type PathParams } from "@/shared/model/routes";
import { useState, useCallback } from "react";
import { Editor } from "@/shared/ui/editor";
import styles from "./styles.module.scss";
import { useEditNote } from "@/features/note/model/use-edit-note";
import { useGetNote } from "@/features/note/model/use-get-note.ts";

function NotePage() {
  const params = useParams<PathParams[typeof ROUTES.NOTE]>();
  const noteId = params.noteId!;

  const { note, isLoading, isError } = useGetNote(noteId);
  const [content, setContent] = useState(note?.content || "");
  const { isPending, editNote } = useEditNote(noteId);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isError || !note) {
    return <div className={styles.notFound}>Note not found</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Edit Note</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          editNote(content);
        }}
      >
        <Editor content={content} onChange={handleContentChange} />
        <button type="submit" className={styles.button} disabled={isPending}>
          Save
        </button>
      </form>
    </div>
  );
}

export const Component = NotePage;
