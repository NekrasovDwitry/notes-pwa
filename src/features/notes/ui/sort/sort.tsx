import { type NotesSortOption } from "../../model/use-filter-notes";
import styles from "./styles.module.scss";

interface SortProps {
  value: NotesSortOption;
  onChange: (value: NotesSortOption) => void;
}

export function Sort({ value, onChange }: SortProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as NotesSortOption)}
      className={styles.sortSelect}
    >
      <option value="updatedAt">Sort by: Last Updated</option>
      <option value="createdAt">Sort by: Created Date</option>
      <option value="content">Sort by: Content</option>
    </select>
  );
}
