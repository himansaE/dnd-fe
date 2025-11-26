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

  // Music Service
  const { updateMood } = useLyriaMusic();
  const musicTracks: Record<string, MusicTrack> | undefined =
    story.music_tracks;

  const resolveTrackPrompt = (trackId?: string, directPrompt?: string) => {
    if (directPrompt) return directPrompt;
    if (!trackId || !musicTracks) return null;
    const track = musicTracks[trackId];
    return track?.prompt ?? null;
  };

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

    const startSegment = story.segments[story.start_segment_id];
    const st = startSegment?.soundtrack;
    const prompt = st ? resolveTrackPrompt(st.track_id, st.prompt) : null;
    if (st?.action === "CHANGE" && prompt) {
      console.log("[PlayScene] Initial music update:", prompt);
      updateMood(prompt);
    }
  }, [story.start_segment_id]);

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

  const onNextCLick = () => {
    if (showChoices || isLoading) return;
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

        // After successful API call, the new segments are automatically added to storyService
        // Now we can proceed to load the segment
        const newSegment = result.segments[option];
        if (newSegment) {
          const st = newSegment.soundtrack;
          const prompt = st ? resolveTrackPrompt(st.track_id, st.prompt) : null;
          if (st?.action === "CHANGE" && prompt) {
            console.log("[PlayScene] Music update (segment-level):", prompt);
            updateMood(prompt);
          }
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
          `Failed to continue the story: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Please try again.`
        );
        setShowChoices(true);
      }
    } else {
      // Segment already loaded locally
      const st = isSegmentLoaded.soundtrack;
      const prompt = st ? resolveTrackPrompt(st.track_id, st.prompt) : null;
      if (st?.action === "CHANGE" && prompt) {
        console.log("[PlayScene] Music update (cached segment):", prompt);
        updateMood(prompt);
      }

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
    </div>
  );
};
