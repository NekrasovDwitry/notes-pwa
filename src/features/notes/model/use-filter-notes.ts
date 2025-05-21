import { useState } from "react";

export type NotesSortOption = "createdAt" | "updatedAt" | "content";

export function useFilterNotes() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NotesSortOption>("updatedAt");

  return {
    search,
    sort,
    setSearch,
    setSort,
  };
}
