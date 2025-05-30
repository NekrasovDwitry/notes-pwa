import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

interface SessionDB extends DBSchema {
  session: {
    key: string;
    value: string;
  };
}

class IndexedDBService {
  private db: IDBPDatabase<SessionDB> | null = null;
  private readonly DB_NAME = "notes-pwa-db";
  private readonly DB_VERSION = 1;
  private readonly SESSION_STORE = "session";

  async init() {
    if (this.db) return;

    this.db = await openDB<SessionDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("session")) {
          db.createObjectStore("session");
        }
      },
    });
  }

  async getSession(): Promise<string | null> {
    await this.init();
    const token = await this.db!.get(this.SESSION_STORE, "token");
    return token ?? null;
  }

  async setSession(token: string): Promise<void> {
    await this.init();
    await this.db!.put(this.SESSION_STORE, token, "token");
  }

  async removeSession(): Promise<void> {
    await this.init();
    await this.db!.delete(this.SESSION_STORE, "token");
  }
}

export const indexedDBService = new IndexedDBService();
