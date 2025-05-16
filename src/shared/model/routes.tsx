import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  NOTES: "/notes",
  NOTE: "/notes/:noteId",
} as const;

export type PathParams = {
  [ROUTES.NOTE]: {
    noteId: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
