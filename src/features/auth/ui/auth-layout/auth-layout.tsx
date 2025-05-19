import React from "react";
import styles from "./styles.module.scss";

interface AuthLayoutProps {
  form: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  footerText: React.ReactNode;
}

export function AuthLayout({
  form,
  title,
  description,
  footerText,
}: AuthLayoutProps) {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>{title}</h1>
          <p className={styles.cardDescription}>{description}</p>
        </div>
        <div className={styles.cardContent}>{form}</div>
        <div className={styles.cardFooter}>
          <p className={styles.footerText}>{footerText}</p>
        </div>
      </div>
    </main>
  );
}
