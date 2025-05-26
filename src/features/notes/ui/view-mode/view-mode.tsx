import styles from "./styles.module.scss";

export type ViewMode = "list" | "card";

interface ViewModeProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewMode({ value, onChange }: ViewModeProps) {
  return (
    <div className={styles.viewMode}>
      <button
        className={`${styles.viewButton} ${value === "list" ? styles.active : ""}`}
        onClick={() => onChange("list")}
      >
        List
      </button>
      <button
        className={`${styles.viewButton} ${value === "card" ? styles.active : ""}`}
        onClick={() => onChange("card")}
      >
        Card
      </button>
    </div>
  );
}
