import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { CONFIG } from "@/shared/model/config.ts";
import type { ApiPaths, ApiSchemas } from "@/shared/api/schema";
import { sessionStore } from "@/shared/model/session.ts";

export const fetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
});

export const rqClient = createClient(fetchClient);

export const publicFetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
});

export const publicRqClient = createClient(publicFetchClient);

fetchClient.use({
  async onRequest({ request }) {
    // Skip auth for public endpoints
    if (request.url.includes("/auth/")) {
      return;
    }

    const token = await sessionStore.refreshToken();

    if (token) {
      request.headers.set("Authorization", "Bearer " + sessionStore.token);
    } else if (navigator.onLine) {
      // Only return unauthorized error if we're online
      return new Response(
        JSON.stringify({
          code: "NOT_AUTHORIZED",
          message: "Not authorized session",
        } as ApiSchemas["Error"]),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    } else if (!sessionStore.isSessionValidForOffline()) {
      // If offline and session is not valid for offline use
      return new Response(
        JSON.stringify({
          code: "OFFLINE_SESSION_EXPIRED",
          message: "Offline session has expired",
        } as ApiSchemas["Error"]),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
