import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  characterApi,
  type CharacterDto,
  type Paged,
} from "@/lib/endpoints/characters";

export const characterKeys = {
  all: ["characters"] as const,
  list: (page?: number, pageSize?: number) =>
    [...characterKeys.all, "list", page, pageSize] as const,
  search: (q: string, page?: number, pageSize?: number) =>
    [...characterKeys.all, "search", q, page, pageSize] as const,
  detail: (id: string) => [...characterKeys.all, "detail", id] as const,
};

export function useCharactersList(params?: {
  page?: number;
  pageSize?: number;
}) {
  return useQuery<Paged<CharacterDto>>({
    queryKey: characterKeys.list(params?.page, params?.pageSize),
    queryFn: () => characterApi.list(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev, // keep previous page while fetching next
  });
}

export function useCharactersSearch(params: {
  q: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery<Paged<CharacterDto>>({
    queryKey: characterKeys.search(params.q, params.page, params.pageSize),
    queryFn: () => characterApi.search(params),
    enabled: !!params.q && params.q.trim().length > 0,
    staleTime: 15_000,
    gcTime: 2 * 60_000,
  });
}

export function useCreateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: characterApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: characterKeys.all });
    },
    onError: (err) => {
      // noop: surface via UI if needed
      console.error(err);
    },
  });
}

export function useUpdateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<CharacterDto, "id" | "createdAt" | "updatedAt">> & {
        image?: File | null;
      };
    }) => characterApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: characterKeys.detail(res.id) });
      qc.invalidateQueries({ queryKey: characterKeys.all });
    },
    onError: (err) => {
      console.error(err);
    },
  });
}

export function useDeleteCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: characterApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: characterKeys.all });
    },
    onError: (err) => {
      console.error(err);
    },
  });
}

export function useAutoSelectCharacters() {
  return useMutation({
    mutationFn: (storyData: {
      title: string;
      description: string;
      plot: string;
    }) => characterApi.autoSelect(storyData),
    onError: (err) => {
      console.error("Auto-select failed:", err);
    },
  });
}
