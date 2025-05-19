import { makeAutoObservable, runInAction } from "mobx";
import { jwtDecode } from "jwt-decode";
import { publicFetchClient } from "@/shared/api/instance.ts";

type Session = {
  userId: string;
  email: string;
  exp: number;
  iat: number;
};

const TOKEN_KEY = "token";

class SessionStore {
  token: string | null = localStorage.getItem(TOKEN_KEY);
  session: Session | null = this.token ? jwtDecode<Session>(this.token) : null;
  refreshTokenPromise: Promise<string | null> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    this.token = token;
    this.session = jwtDecode<Session>(token);
  };

  logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    this.token = null;
    this.session = null;
  };

  refreshToken = async (): Promise<string | null> => {
    if (!this.token) return null;

    const session = jwtDecode<Session>(this.token);
    if (session.exp < Date.now() / 1000) {
      if (!this.refreshTokenPromise) {
        this.refreshTokenPromise = publicFetchClient
          .POST("/auth/refresh")
          .then((r) => r.data?.accessToken ?? null)
          .then((newToken) => {
            runInAction(() => {
              if (newToken) {
                this.login(newToken);
              } else {
                this.logout();
              }
            });
            return newToken;
          })
          .finally(() => {
            this.refreshTokenPromise = null;
          });
      }

      return await this.refreshTokenPromise;
    }

    return this.token;
  };
}

export const sessionStore = new SessionStore();
