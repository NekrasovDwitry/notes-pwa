import { Link, href } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { getTitleFromContent } from "../../model/note-utils";

interface NoteItemProps {
  id: string;
  content: string;
  updatedAt: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

export function NoteItem({
  id,
  content,
  updatedAt,
  isDeleting,
  onDelete,
}: NoteItemProps) {
  return (
    <div className={styles.note}>
      <div className={styles.info}>
        <Link to={href(ROUTES.NOTE, { noteId: id })}>
          {getTitleFromContent(content)}
        </Link>
        <span>{dayjs(updatedAt).format("DD.MM.YYYY")}</span>
      </div>
      <button
        className={styles.button}
        disabled={isDeleting}
        onClick={() => onDelete(id)}
      >
        Delete
      </button>
    </div>
  );
}
