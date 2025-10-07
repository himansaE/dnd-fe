import Request from "@/lib/http";

export type CharacterDto = {
  id: string;
  name: string;
  type: string;
  ability?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const characterApi = {
  async list(params?: { page?: number; pageSize?: number }) {
    const res = await Request.get<Paged<CharacterDto>>("/api/characters", {
      params,
    });
    return res.data;
  },
  async search(params: { q: string; page?: number; pageSize?: number }) {
    const res = await Request.get<Paged<CharacterDto>>(
      "/api/characters/search",
      {
        params,
      }
    );
    return res.data;
  },
  async get(id: string) {
    const res = await Request.get<CharacterDto>(`/api/characters/${id}`);
    return res.data;
  },
  async byIds(ids: string[]) {
    const res = await Request.get<CharacterDto[]>(`/api/characters/by-ids`, {
      params: { ids: ids.join(",") },
    });
    return res.data;
  },
  async create(data: Omit<CharacterDto, "id" | "createdAt" | "updatedAt">) {
    const res = await Request.post<CharacterDto>("/api/characters", data);
    return res.data;
  },
  async update(
    id: string,
    data: Partial<Omit<CharacterDto, "id" | "createdAt" | "updatedAt">>
  ) {
    const res = await Request.put<CharacterDto>(`/api/characters/${id}`, data);
    return res.data;
  },
  async remove(id: string) {
    const res = await Request.delete<CharacterDto>(`/api/characters/${id}`);
    return res.data;
  },
};
