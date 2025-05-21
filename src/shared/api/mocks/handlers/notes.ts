import { HttpResponse } from "msw";
import { http } from "../http";
import type { ApiSchemas } from "../../schema";
import { verifyTokenOrThrow } from "@/shared/api/mocks/session.ts";

const generateMockNotes = (count: number): ApiSchemas["Note"][] => {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(now - i * 1000 * 60 * 60).toISOString();
    return {
      id: String(i + 1),
      content: `<p>Sample note content #${i + 1}</p>`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
};

const mockNotes: ApiSchemas["Note"][] = generateMockNotes(50);

export const notesHandlers = [
  http.get("/notes", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);

    const url = new URL(ctx.request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort");

    let filteredNotes = [...mockNotes];

    if (search) {
      filteredNotes = filteredNotes.filter((note) =>
        note.content.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sort) {
      filteredNotes.sort((a, b) => {
        if (sort === "content") {
          return a.content.localeCompare(b.content);
        } else {
          return (
            new Date(b[sort as keyof ApiSchemas["Note"]].toString()).getTime() -
            new Date(a[sort as keyof ApiSchemas["Note"]].toString()).getTime()
          );
        }
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const total = filteredNotes.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filteredNotes.slice(start, end);

    return HttpResponse.json({
      list: paginated,
      total,
      totalPages,
    });
  }),

  http.get("/notes/{noteId}", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);

    const { noteId } = ctx.params;
    const note = mockNotes.find((n) => n.id === noteId);
    if (!note) {
      return HttpResponse.json(
        { message: "Note not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return HttpResponse.json(note);
  }),

  http.post("/notes", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);

    const now = new Date().toISOString();
    const note: ApiSchemas["Note"] = {
      id: String(mockNotes.length + 1),
      content: "",
      createdAt: now,
      updatedAt: now,
    };

    mockNotes.push(note);
    return HttpResponse.json(note, { status: 201 });
  }),

  http.put("/notes/{noteId}", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);

    const { noteId } = ctx.params;
    const note = mockNotes.find((note) => note.id === noteId);
    if (!note) {
      return HttpResponse.json(
        { message: "Note not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const data = (await ctx.request.json()) as ApiSchemas["EditNote"];

    note.content = data.content;
    note.updatedAt = new Date().toISOString();

    return HttpResponse.json(note, { status: 201 });
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
