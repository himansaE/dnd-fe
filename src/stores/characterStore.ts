import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character as StoryCharacter } from "@/lib/endpoints/story";

export type Character = StoryCharacter & { id: string };

interface CharacterState {
  characters: Character[];

  addCharacter: (data: Omit<Character, "id">) => Character;
  updateCharacter: (
    id: string,
    updates: Partial<Omit<Character, "id">>
  ) => void;
  deleteCharacter: (id: string) => void;
  setCharacters: (list: Character[]) => void;
  reset: () => void;
}

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      characters: [],

      addCharacter: (data) => {
        const id = generateId();
        const newChar: Character = { id, ...data } as Character;
        set({ characters: [newChar, ...get().characters] });
        return newChar;
      },

      updateCharacter: (id, updates) => {
        set({
          characters: get().characters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        });
      },

      deleteCharacter: (id) => {
        set({ characters: get().characters.filter((c) => c.id !== id) });
      },

      setCharacters: (list) => set({ characters: list }),

      reset: () => set({ characters: [] }),
    }),
    {
      name: "dnd-characters-storage",
    }
  )
);
