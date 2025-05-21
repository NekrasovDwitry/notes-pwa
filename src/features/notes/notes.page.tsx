import { Link, href } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import styles from "./styles.module.scss";
import { useCreateNote } from "@/features/notes/model/use-create-note";
import { useDeleteNote } from "@/features/notes/model/use-delete-note";
import { useGetNotes } from "@/features/notes/model/use-get-notes";
import {
  type NotesSortOption,
  useFilterNotes,
} from "@/features/notes/model/use-filter-notes";
import dayjs from "dayjs";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value.ts";

function NotesPage() {
  const { isPending: isCreating, createNote } = useCreateNote();
  const { deleteNote, getIsPending } = useDeleteNote();
  const { search, sort, setSearch, setSort } = useFilterNotes();
  const debouncedSearch = useDebounceValue(search, 300);
  const { notes, isPending, isFetchingNextPage, hasNextPage, cursorRef } =
    useGetNotes({
      limit: 10,
      search: debouncedSearch,
      sort,
    });

  const getTitleFromContent = (content: string) =>
    new DOMParser()
      .parseFromString(content, "text/html")
      .body.firstElementChild?.textContent?.trim() || "Untitled Note";

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Notes</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as NotesSortOption)}
          className={styles.sortSelect}
        >
          <option value="updatedAt">Sort by: Last Updated</option>
          <option value="createdAt">Sort by: Created Date</option>
          <option value="content">Sort by: Content</option>
        </select>
      </div>

      <button
        className={styles.button}
        disabled={isCreating}
        onClick={() => createNote()}
      >
        Create note
      </button>

      <div className={styles.notes}>
        {notes.map((note) => (
          <div className={styles.note} key={note.id}>
            <div className={styles.info}>
              <Link to={href(ROUTES.NOTE, { noteId: note.id })}>
                {getTitleFromContent(note.content)}
              </Link>
              <span>{dayjs(note.updatedAt).format("DD.MM.YYYY")}</span>
            </div>
            <button
              className={styles.button}
              disabled={getIsPending(note.id)}
              onClick={() => deleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div ref={cursorRef} className={styles.observer}>
          {isFetchingNextPage && "Loading more..."}
        </div>
      )}

      {isPending && <div className={styles.loading}>Loading notes...</div>}
    </div>
  );
}

export const Component = NotesPage;
