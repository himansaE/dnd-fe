import Backdrop from "@/assets/images/play-backdrop.png";
import { ChatDialogWindow } from "./dialogWindow";
import placeholderMale from "@/assets/images/placeholder-male.png";
import placeholderFemale from "@/assets/images/placeholder-female.png";
import { useEffect, useState } from "react";
import { SingleSegmentOutput, StoryGraph } from "@/lib/endpoints/story";
import { OptionDialog } from "./optionDialog";
import { storyService } from "@/lib/storyStore";
import { useContinueStory } from "@/lib/hooks/useContinueStory";
import { useStoryStore } from "@/stores/storyStore";

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

  // Get story continuation functionality
  const continueStoryMutation = useContinueStory();
  const selectedStory = useStoryStore((state) => state.selectedStory);

  // Initialize flow and history with the starting segment once on mount
  useEffect(() => {
    storyService.setFlowHistory([story.start_segment_id]);
    storyService.addSegmentToHistory(story.start_segment_id);
  }, [story.start_segment_id]);

  // Combined loading state from the mutation
  const isLoading = continueStoryMutation.isPending;
  const continueStoryError = continueStoryMutation.error?.message || null;

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
          storyService.addSegmentToHistory(option);
          storyService.addFlowStep(option);
          setLoadedSegments(newSegment);
          setCurrentSceneId(option);
          setNarrativeIndex(0);
        }
      } catch (error) {
        console.error("Failed to continue story:", error);
        // If there's an error, we might want to show choices again
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
      <ChatDialogWindow
        content={
          continueStoryError
            ? { type: "narrator", text: `Error: ${continueStoryError}` }
            : isLoading
            ? { type: "narrator", text: "Loading next part of the story..." }
            : loadedSegments.narrative_content[narrativeIndex]
        }
      />

      <>
        <img
          src={placeholderMale}
          alt="Placeholder male character"
          className="absolute left-10 bottom-0 w-xl h-xl shadow-lg translate-y-16"
        />
        <img
          src={placeholderFemale}
          alt="Placeholder female character"
          className="absolute -right-24 bottom-0 w-xl h-xl rounded-full shadow-lg translate-y-12"
        />
        <div className="absolute bottom-0 left-10 w-lg h-lg text-white text-2xl font-bold translate-y-10"></div>
      </>

      <OptionDialog
        isOpen={showChoices}
        onSelect={onSelectOption}
        options={loadedSegments.choices}
        disabled={isLoading}
      />
    </div>
  );
};
