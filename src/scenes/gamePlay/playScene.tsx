import Backdrop from "@/assets/images/play-backdrop.png";
import { ChatDialogWindow } from "./dialogWindow";
import { useEffect, useState, useMemo } from "react";
import {
  MusicTrack,
  SingleSegmentOutput,
  StoryGraph,
} from "@/lib/endpoints/story";
import { OptionDialog } from "./optionDialog";
import { storyService } from "@/lib/storyStore";
import { useContinueStory } from "@/lib/hooks/useContinueStory";
import { useStoryStore } from "@/stores/storyStore";
import { findCharacterMatch } from "@/lib/utils/characterMatching";
import { useLyriaMusic } from "@/lib/hooks/useLyriaMusic";
import { PauseMenu } from "./pauseMenu";

type PlaySceneProps = {
  story: StoryGraph;
};

export const PlayScene = ({ story }: PlaySceneProps) => {
  const [currentSceneId, setCurrentSceneId] = useState(story.start_segment_id);
  const [loadedSegments, setLoadedSegments] = useState<SingleSegmentOutput>(
    story.segments[story.start_segment_id]
  );
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Music Service
  const { updateMood } = useLyriaMusic();
  const [musicTracks, setMusicTracks] = useState<Record<string, MusicTrack>>(
    story.music_tracks || {}
  );
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  // Get story continuation functionality
  const continueStoryMutation = useContinueStory();
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const selectedCharacters = useStoryStore((state) => state.selectedCharacters);

  // Combined loading state from the mutation
  const isLoading = continueStoryMutation.isPending;
  const continueStoryError = continueStoryMutation.error?.message || null;

  // Get current narrative item
  const currentNarrative = useMemo(() => {
    if (continueStoryError) {
      return {
        type: "narrator",
        text: `Error: ${continueStoryError}`,
      } as const;
    }
    if (isLoading) {
      return {
        type: "narrator",
        text: "Loading next part of the story...",
      } as const;
    }
    return loadedSegments.narrative_content[narrativeIndex];
  }, [narrativeIndex, loadedSegments, isLoading, continueStoryError]);

  // Find character image for current speaker
  const currentCharacterImage = useMemo(() => {
    if (currentNarrative.type !== "character") return null;

    const match = findCharacterMatch(
      selectedCharacters,
      (currentNarrative as any).characterId,
      currentNarrative.name
    );

    return match?.imageUrl ?? null;
  }, [currentNarrative, selectedCharacters]);

  // Initialize flow and history with the starting segment once on mount
  useEffect(() => {
    storyService.setFlowHistory([story.start_segment_id]);
    storyService.addSegmentToHistory(story.start_segment_id);
  }, [story.start_segment_id]);

  // Centralized music management effect
  useEffect(() => {
    const st = loadedSegments.soundtrack;
    if (!st) return;

    const trackId = st.track_id;

    // If we have a track ID and it's different from the current one
    if (trackId && trackId !== currentTrackId) {
      const track = musicTracks[trackId];
      if (track) {
        console.log(`[PlayScene] Switching track to ${trackId}:`, track.prompt);
        updateMood(track.prompt);
        setCurrentTrackId(trackId);
      } else {
        console.warn(`[PlayScene] Track ${trackId} not found in musicTracks`);
        // Fallback: if direct prompt exists in soundtrack, use it
        if (st.prompt) {
          console.log(`[PlayScene] Using fallback prompt for ${trackId}`);
          updateMood(st.prompt);
          setCurrentTrackId(trackId);
        }
      }
    } else if (!trackId && st.prompt && st.prompt !== currentTrackId) {
      // Handle legacy/fallback case where only prompt is provided
      // We use the prompt itself as the ID to avoid re-triggering if it's the same string
      console.log(`[PlayScene] Using direct prompt`);
      updateMood(st.prompt);
      setCurrentTrackId(st.prompt);
    }
  }, [loadedSegments, musicTracks, currentTrackId, updateMood]);

  // Preload character images on mount
  useEffect(() => {
    console.log("[PlayScene] Preloading character images...");
    selectedCharacters.forEach((char) => {
      if (char.imageUrl) {
        const img = new Image();
        img.src = char.imageUrl;
      }
    });
  }, [selectedCharacters]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onNextCLick = () => {
    if (showChoices || isLoading || isPaused) return;
    if (narrativeIndex < loadedSegments.narrative_content.length - 1) {
      setNarrativeIndex(narrativeIndex + 1);
    } else {
      setShowChoices(true);
    }
  };

  const onSelectOption = async (option: string) => {
    // Check if the segment is already loaded locally
    const isSegmentLoaded = storyService.getSegment(option);

    // Find the selected choice
    const selectedChoice = loadedSegments.choices.find(
      (choice) => choice.next_segment_id === option
    );

    if (!selectedChoice) {
      console.error("Invalid choice selected");
      return;
    }

    // Close the dialog immediately when a choice is selected
    setShowChoices(false);

    if (!isSegmentLoaded) {
      // Segment not loaded, need to call continue story API
      if (!selectedStory) {
        console.error("No selected story available for continuation");
        return;
      }

      try {
        const result = await continueStoryMutation.mutateAsync({
          conversationHistory: storyService.getApiMessageHistory(),
          currentSegmentId: currentSceneId,
          choiceId: selectedChoice.text, // Using choice text as choice ID
          nextSegmentId: option,
        });

        // Update music tracks if new ones are provided
        if (result.music_tracks) {
          setMusicTracks((prev) => ({ ...prev, ...result.music_tracks }));
        }

        // After successful API call, the new segments are automatically added to storyService
        // Now we can proceed to load the segment
        const newSegment = result.segments[option];
        if (newSegment) {
          storyService.addSegmentToHistory(option);
          storyService.addFlowStep(option);
          setLoadedSegments(newSegment);
          setCurrentSceneId(option);
          setNarrativeIndex(0);
        } else {
          // CRITICAL: The requested segment ID is missing from the response
          console.error(
            `SEGMENT MISSING: Requested segment "${option}" not found in AI response`
          );
          console.error(
            "Available segments:",
            Object.keys(result.segments ?? {})
          );

          // Show an error message to the user
          alert(
            `Story generation error: The AI failed to generate the requested story segment. Please try a different choice or refresh the page.`
          );

          // Show choices again so user can try another option
          setShowChoices(true);
        }
      } catch (error) {
        console.error("Failed to continue story:", error);
        // If there's an error, show an alert and show choices again
        alert(
          `Failed to continue the story: ${error instanceof Error ? error.message : "Unknown error"
          }. Please try again.`
        );
        setShowChoices(true);
      }
    } else {
      // Segment already loaded locally
      storyService.addSegmentToHistory(option);
      storyService.addFlowStep(option);
      setLoadedSegments(isSegmentLoaded);
      setCurrentSceneId(option);
      setNarrativeIndex(0);
    }
  };

  return (
    <div
      className="flex flex-col gap-5 items-center justify-center min-h-screen bg-charcoal bg-center bg-contain relative"
      style={{
        backgroundImage: `url(${Backdrop})`,
      }}
      onClick={onNextCLick}
    >
      <ChatDialogWindow content={currentNarrative} />

      {/* Character image - only show when a character is speaking */}
      {currentCharacterImage && (
        <img
          src={currentCharacterImage}
          alt="Speaking character"
          className="absolute left-10 bottom-0 w-xl h-xl shadow-lg translate-y-16 transition-opacity duration-300"
          key={currentCharacterImage}
        />
      )}

      <OptionDialog
        isOpen={showChoices}
        onSelect={onSelectOption}
        options={loadedSegments.choices}
        disabled={isLoading}
      />

      {isPaused && <PauseMenu onResume={() => setIsPaused(false)} />}
    </div>
  );
};
