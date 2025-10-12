import Request from "@/lib/http";

export type CharacterDto = {
  id: string;
  name: string;
  type: string;
  ability?: string;
  description?: string;
  imageKey?: string;
  imageUrl?: string;
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
  async create(
    data: Omit<CharacterDto, "id" | "createdAt" | "updatedAt"> & {
      image?: File | null;
    }
  ) {
    // Use multipart/form-data when image is present
    if (data && (data as any).image) {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("type", data.type);
      if (data.ability) fd.append("ability", data.ability);
      if (data.description) fd.append("description", data.description);
      fd.append("image", (data as any).image);
      const res = await Request.post<CharacterDto>("/api/characters", fd);
      return res.data;
    }
    const { image, ...json } = data as any;
    const res = await Request.post<CharacterDto>("/api/characters", json);
    return res.data;
  },
  async update(
    id: string,
    data: Partial<Omit<CharacterDto, "id" | "createdAt" | "updatedAt">> & {
      image?: File | null;
    }
  ) {
    if ((data as any).image) {
      const fd = new FormData();
      if (data.name) fd.append("name", data.name);
      if (data.type) fd.append("type", data.type);
      if (data.ability) fd.append("ability", data.ability);
      if (data.description) fd.append("description", data.description);
      fd.append("image", (data as any).image);
      const res = await Request.put<CharacterDto>(`/api/characters/${id}`, fd);
      return res.data;
    }
    const { image, ...json } = data as any;
    const res = await Request.put<CharacterDto>(`/api/characters/${id}`, json);
    return res.data;
  },
  async remove(id: string) {
    const res = await Request.delete<CharacterDto>(`/api/characters/${id}`);
    return res.data;
  },
  async autoSelect(storyData: {
    title: string;
    description: string;
    plot: string;
  }) {
    const res = await Request.post<{
      characters: CharacterDto[];
      analysis: Array<{
        characterId: string;
        characterName: string;
        tacticalScore: number;
        narrativeScore: number;
        reasoning: string;
      }>;
      strategy: string;
    }>("/api/characters/auto-select", storyData);
    return res.data;
  },
};
