import { create } from "zustand";
import { storyGeneratorRes } from "@/lib/endpoints/storyGenarator";

interface StoryState {
  // Available stories fetched from the API
  availableStories: storyGeneratorRes[];

  // Currently selected story
  selectedStory: storyGeneratorRes | null;

  // Set the available stories (from API)
  setAvailableStories: (stories: storyGeneratorRes[]) => void;

  // Select a story
  selectStory: (story: storyGeneratorRes) => void;

  // Clear current selection
  clearSelection: () => void;

  // Reset the entire store
  reset: () => void;
}

export const useStoryStore = create<StoryState>()((set) => ({
  availableStories: [],
  selectedStory: null,

  setAvailableStories: (stories) => set({ availableStories: stories }),

  selectStory: (story) => set({ selectedStory: story }),

  clearSelection: () => set({ selectedStory: null }),

  reset: () => set({ availableStories: [], selectedStory: null }),
}));
