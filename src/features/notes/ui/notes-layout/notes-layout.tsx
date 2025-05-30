import { type ReactNode } from "react";
import styles from "./styles.module.scss";
import { type ViewMode } from "../view-mode/view-mode";

interface NotesLayoutProps {
  viewMode: ViewMode;
  notes: ReactNode[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
  cursorRef: (node: HTMLDivElement | null) => void;
}

export function NotesLayout({
  viewMode,
  notes,
  hasNextPage,
  isFetchingNextPage,
  isPending,
  cursorRef,
}: NotesLayoutProps) {
  return (
    <>
      <div className={viewMode === "list" ? styles.notes : styles.notesGrid}>
        {notes}
      </div>

      {hasNextPage && (
        <div ref={cursorRef} className={styles.observer}>
          {isFetchingNextPage && "Loading more..."}
        </div>
      )}

      {isPending && <div className={styles.loading}>Loading notes...</div>}
    </>
  );
}
