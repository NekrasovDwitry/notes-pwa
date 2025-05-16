import { HttpResponse } from "msw";
import { http } from "../http";
import type { ApiSchemas } from "../../schema";

const notes: ApiSchemas["Note"][] = [
  {
    id: "note-1",
    title: "First Note",
    content: "Content",
  },
  {
    id: "note-2",
    title: "Second Note",
    content: "Content",
  },
];

export const handlers = [
  http.get("/notes", () => {
    return HttpResponse.json(notes);
  }),

  http.post("/notes", async (ctx) => {
    const data = await ctx.request.json();
    const note = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
    };
    notes.push(note);

    return HttpResponse.json(note, { status: 201 });
  }),

  http.put("/notes/{noteId}", async (ctx) => {
    const { noteId } = ctx.params;
    const data = await ctx.request.json();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    if (noteIndex === -1) {
      return HttpResponse.json(
        { message: "Note not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      title: data.title,
      content: data.content,
    };

    return HttpResponse.json(notes[noteIndex]);
  }),

  http.delete("/notes/{noteId}", (ctx) => {
    const { noteId } = ctx.params;
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    if (noteIndex === -1) {
      return HttpResponse.json(
        { message: "Note not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    notes.splice(noteIndex, 1);

    return HttpResponse.json({ message: "Note deleted", code: "OK" });
  }),
];
