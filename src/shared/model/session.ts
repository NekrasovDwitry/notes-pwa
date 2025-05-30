import { makeAutoObservable, runInAction } from "mobx";
import { jwtDecode } from "jwt-decode";
import { publicFetchClient } from "@/shared/api/instance.ts";
import { indexedDBService } from "./indexed-db";

type Session = {
  userId: string;
  email: string;
  exp: number;
};

// Maximum time in seconds that a session can be used offline
const OFFLINE_SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours

class SessionStore {
  token: string | null = null;
  session: Session | null = null;
  refreshTokenPromise: Promise<string | null> | null = null;
  isOnline: boolean = navigator.onLine;
  lastSyncTimestamp: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.init();
    this.setupOnlineStatusListeners();
  }

  private setupOnlineStatusListeners() {
    window.addEventListener("online", this.handleOnlineStatusChange);
    window.addEventListener("offline", this.handleOnlineStatusChange);
  }

  private handleOnlineStatusChange = () => {
    runInAction(() => {
      this.isOnline = navigator.onLine;
      if (this.isOnline) {
        this.syncSession();
      }
    });
  };

  private async init() {
    const token = await indexedDBService.getSession();
    if (token) {
      const session = jwtDecode<Session>(token);
      const now = Date.now() / 1000;

      // Check if session is still valid for offline use
      if (session.exp + OFFLINE_SESSION_MAX_AGE > now) {
        runInAction(() => {
          this.token = token;
          this.session = session;
          this.lastSyncTimestamp = now;
        });
      } else {
        // Session is too old for offline use
        await this.logout();
      }
    }
  }

  private async syncSession() {
    if (!this.token || !this.session) return;

    try {
      // Try to refresh the token when coming back online
      const newToken = await this.refreshToken();
      if (newToken) {
        runInAction(() => {
          this.lastSyncTimestamp = Date.now() / 1000;
        });
      }
    } catch (error) {
      console.error("Failed to sync session:", error);
      // If we can't sync, we'll keep using the offline session
      // until it expires
    }
  }

  login = async (token: string) => {
    await indexedDBService.setSession(token);
    const session = jwtDecode<Session>(token);
    runInAction(() => {
      this.token = token;
      this.session = session;
      this.lastSyncTimestamp = Date.now() / 1000;
    });
  };

  logout = async () => {
    await indexedDBService.removeSession();
    runInAction(() => {
      this.token = null;
      this.session = null;
      this.lastSyncTimestamp = null;
    });
  };

  refreshToken = async (): Promise<string | null> => {
    if (!this.token) return null;

    const session = jwtDecode<Session>(this.token);
    const now = Date.now() / 1000;

    // If we're offline, check if the session is still valid for offline use
    if (!this.isOnline) {
      if (session.exp + OFFLINE_SESSION_MAX_AGE > now) {
        return this.token;
      }
      await this.logout();
      return null;
    }

    // If we're online, try to refresh the token
    if (session.exp < now) {
      if (!this.refreshTokenPromise) {
        this.refreshTokenPromise = publicFetchClient
          .POST("/auth/refresh")
          .then((r) => r.data?.accessToken ?? null)
          .then(async (newToken) => {
            if (newToken) {
              await this.login(newToken);
              return newToken;
            } else {
              await this.logout();
              return null;
            }
          })
          .finally(() => {
            this.refreshTokenPromise = null;
          });
      }
      return this.refreshTokenPromise;
    }

    return this.token;
  };

  // Helper method to check if session is valid for offline use
  isSessionValidForOffline = (): boolean => {
    if (!this.session || !this.lastSyncTimestamp) return false;

    const now = Date.now() / 1000;
    return this.session.exp + OFFLINE_SESSION_MAX_AGE > now;
  };
}

export const sessionStore = new SessionStore();
