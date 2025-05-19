import { HttpResponse } from "msw";
import { http } from "../http";
import type { ApiSchemas } from "../../schema";
import { verifyTokenOrThrow } from "@/shared/api/mocks/session.ts";

const mockNotes: ApiSchemas["Note"][] = [
  {
    id: "1",
    title: "First Note",
    content: "Content",
  },
  {
    id: "2",
    title: "Second Note",
    content: "Content",
  },
];

export const notesHandlers = [
  http.get("/notes", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);
    return HttpResponse.json(mockNotes);
  }),

  http.post("/notes", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);
    const data = await ctx.request.json();
    const note = {
      id: String(mockNotes.length + 1),
      title: data.title,
      content: data.content,
    };
    mockNotes.push(note);

    return HttpResponse.json(note, { status: 201 });
  }),

  http.put("/notes/{noteId}", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);
    const { noteId } = ctx.params;
    const data = await ctx.request.json();
    const noteIndex = mockNotes.findIndex((note) => note.id === noteId);
    if (noteIndex === -1) {
      return HttpResponse.json(
        { message: "Note not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    mockNotes[noteIndex] = {
      ...mockNotes[noteIndex],
      title: data.title,
      content: data.content,
    };

    return HttpResponse.json(mockNotes[noteIndex]);
  }),

  http.delete("/notes/{noteId}", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);
    const { noteId } = ctx.params;
    const noteIndex = mockNotes.findIndex((note) => note.id === noteId);
    if (noteIndex === -1) {
      return HttpResponse.json(
        { message: "Note not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    mockNotes.splice(noteIndex, 1);

    return HttpResponse.json({ message: "Note deleted", code: "OK" });
  }),
];
