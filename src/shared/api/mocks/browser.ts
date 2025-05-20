import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth.ts";
import { notesHandlers } from "@/shared/api/mocks/handlers/notes.ts";

export const worker = setupWorker(...authHandlers, ...notesHandlers);
