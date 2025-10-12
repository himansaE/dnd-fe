import { create } from "zustand";
import { storyGeneratorRes } from "@/lib/endpoints/storyGenarator";
import { Character, StoryStartRes } from "@/lib/endpoints/story";
import type { CharacterDto } from "@/lib/endpoints/characters";

// Start scene response type from API

interface StoryState {
  // Available stories fetched from the API
  availableStories: storyGeneratorRes[];

  // Currently selected story
  selectedStory: storyGeneratorRes | null;

  // Story starting data after API call
  storyStartData: StoryStartRes | null;

  // Characters in the story (AI-generated, deprecated)
  characters: Character[];

  // User-selected characters for the story (10 required)
  selectedCharacters: CharacterDto[];

  // Current scene text
  currentScene: string;

  // Set the available stories (from API)
  setAvailableStories: (stories: storyGeneratorRes[]) => void;

  // Select a story
  selectStory: (story: storyGeneratorRes) => void;

  // Clear current selection
  clearSelection: () => void;

  // Set story start data from API
  setStoryStartData: (startData: StoryStartRes) => void;

  // Set selected characters (exactly 10)
  setSelectedCharacters: (characters: CharacterDto[]) => void;

  // Reset the entire store
  reset: () => void;
}

export const useStoryStore = create<StoryState>()((set) => ({
  availableStories: [],
  selectedStory: null,
  storyStartData: null,
  characters: [],
  selectedCharacters: [],
  currentScene: "",

  setAvailableStories: (stories) => set({ availableStories: stories }),

  selectStory: (story) => set({ selectedStory: story }),

  clearSelection: () => set({ selectedStory: null, selectedCharacters: [] }),

  setStoryStartData: (startData) =>
    set({
      storyStartData: startData,
      characters: startData.storyBase.characters,
      currentScene: startData.storyBase.scene,
    }),

  setSelectedCharacters: (characters) =>
    set({ selectedCharacters: characters }),

  reset: () =>
    set({
      availableStories: [],
      selectedStory: null,
      storyStartData: null,
      characters: [],
      selectedCharacters: [],
      currentScene: "",
    }),
}));
