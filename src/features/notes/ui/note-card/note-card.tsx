import { Link, href } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { getTitleFromContent, getPreviewContent } from "../../model/note-utils";

interface NoteCardProps {
  id: string;
  content: string;
  updatedAt: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

export function NoteCard({
  id,
  content,
  updatedAt,
  isDeleting,
  onDelete,
}: NoteCardProps) {
  return (
    <div className={styles.noteCard}>
      <Link to={href(ROUTES.NOTE, { noteId: id })} className={styles.cardLink}>
        <h3 className={styles.cardTitle}>{getTitleFromContent(content)}</h3>
        <p className={styles.cardPreview}>{getPreviewContent(content)}</p>
        <span className={styles.cardDate}>
          {dayjs(updatedAt).format("DD.MM.YYYY")}
        </span>
      </Link>
      <button
        className={styles.cardDeleteButton}
        disabled={isDeleting}
        onClick={() => onDelete(id)}
      >
        Delete
      </button>
    </div>
  );
}
