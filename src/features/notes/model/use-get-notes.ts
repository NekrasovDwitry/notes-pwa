import { rqClient } from "@/shared/api/instance";
import { keepPreviousData } from "@tanstack/query-core";
import { type RefCallback, useCallback } from "react";

type UseGetNotesParams = {
  limit?: number;
  search?: string;
  sort?: "createdAt" | "updatedAt" | "content";
};

export function useGetNotes({ limit = 20, search, sort }: UseGetNotesParams) {
  const { fetchNextPage, data, isFetchingNextPage, isPending, hasNextPage } =
    rqClient.useInfiniteQuery(
      "get",
      "/notes",
      {
        params: {
          query: {
            page: 1,
            limit,
            search,
            sort,
          },
        },
      },
      {
        initialPageParam: 1,
        pageParamName: "page",
        getNextPageParam: (lastPage, _, lastPageParams) =>
          Number(lastPageParams) < lastPage.totalPages
            ? Number(lastPageParams) + 1
            : null,

        placeholderData: keepPreviousData,
      },
    );

  const cursorRef: RefCallback<HTMLDivElement> = useCallback(
    (el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 },
      );

      if (el) {
        observer.observe(el);

        return () => {
          observer.disconnect();
        };
      }
    },
    [fetchNextPage],
  );

  const notes = data?.pages.flatMap((page) => page.list) ?? [];

  return {
    notes,
    isFetchingNextPage,
    isPending,
    hasNextPage,
    cursorRef,
  };
}
