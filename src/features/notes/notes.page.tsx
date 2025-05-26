import styles from "./styles.module.scss";
import { useCreateNote } from "@/features/notes/model/use-create-note";
import { useDeleteNote } from "@/features/notes/model/use-delete-note";
import { useGetNotes } from "@/features/notes/model/use-get-notes";
import { useFilterNotes } from "@/features/notes/model/use-filter-notes";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value.ts";
import { Search } from "./ui/search/search";
import { Sort } from "./ui/sort/sort";
import { NoteItem } from "./ui/note-item/note-item";
import { NoteCard } from "./ui/note-card/note-card";
import {
  ViewMode,
  type ViewMode as ViewModeType,
} from "./ui/view-mode/view-mode";
import { FiltersLayout } from "./ui/filters-layout/filters-layout";
import { NotesLayout } from "./ui/notes-layout/notes-layout";
import { useState } from "react";

function NotesPage() {
  const { isPending: isCreating, createNote } = useCreateNote();
  const { deleteNote, getIsPending } = useDeleteNote();
  const { search, sort, setSearch, setSort } = useFilterNotes();
  const [viewMode, setViewMode] = useState<ViewModeType>("list");
  const debouncedSearch = useDebounceValue(search, 300);
  const { notes, isPending, isFetchingNextPage, hasNextPage, cursorRef } =
    useGetNotes({
      limit: 10,
      search: debouncedSearch,
      sort,
    });

  const noteElements = notes.map((note) =>
    viewMode === "list" ? (
      <NoteItem
        key={note.id}
        id={note.id}
        content={note.content}
        updatedAt={note.updatedAt}
        isDeleting={getIsPending(note.id)}
        onDelete={deleteNote}
      />
    ) : (
      <NoteCard
        key={note.id}
        id={note.id}
        content={note.content}
        updatedAt={note.updatedAt}
        isDeleting={getIsPending(note.id)}
        onDelete={deleteNote}
      />
    )
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Notes</h1>

      <FiltersLayout
        search={<Search value={search} onChange={setSearch} />}
        sort={<Sort value={sort} onChange={setSort} />}
        action={<ViewMode value={viewMode} onChange={setViewMode} />}
      />

      <button
        className={styles.button}
        disabled={isCreating}
        onClick={() => createNote()}
      >
        Create note
      </button>

      <NotesLayout
        viewMode={viewMode}
        notes={noteElements}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        cursorRef={cursorRef}
      />
    </div>
  );
}

export const Component = NotesPage;
