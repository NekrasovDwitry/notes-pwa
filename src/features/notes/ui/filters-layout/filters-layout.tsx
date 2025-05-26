import { type ReactNode } from "react";
import styles from "./styles.module.scss";

interface FiltersLayoutProps {
  search: ReactNode;
  sort?: ReactNode;
  action: ReactNode;
}

export function FiltersLayout({ search, sort, action }: FiltersLayoutProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.filtersMain}>
        {search}
        {sort}
      </div>
      <div className={styles.filtersAction}>{action}</div>
    </div>
  );
}
