import { create } from "zustand";
import { storyGeneratorRes } from "@/lib/endpoints/storyGenarator";
import { Character, StoryStartRes } from "@/lib/endpoints/storyStart";

// Start scene response type from API

interface StoryState {
  // Available stories fetched from the API
  availableStories: storyGeneratorRes[];

  // Currently selected story
  selectedStory: storyGeneratorRes | null;

  // Story starting data after API call
  storyStartData: StoryStartRes | null;

  // Characters in the story
  characters: Character[];

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

  // Reset the entire store
  reset: () => void;
}

export const useStoryStore = create<StoryState>()((set) => ({
  availableStories: [],
  selectedStory: null,
  storyStartData: null,
  characters: [],
  currentScene: "",

  setAvailableStories: (stories) => set({ availableStories: stories }),

  selectStory: (story) => set({ selectedStory: story }),

  clearSelection: () => set({ selectedStory: null }),

  setStoryStartData: (startData) =>
    set({
      storyStartData: startData,
      characters: startData.storyBase.characters,
      currentScene: startData.storyBase.scene,
    }),

  reset: () =>
    set({
      availableStories: [],
      selectedStory: null,
      storyStartData: null,
      characters: [],
      currentScene: "",
    }),
}));
