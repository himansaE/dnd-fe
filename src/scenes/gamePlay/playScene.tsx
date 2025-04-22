import Backdrop from "@/assets/images/play-backdrop.png";
import { ChatDialogWindow } from "./dialogWindow";
import placeholderMale from "@/assets/images/placeholder-male.png";
import placeholderFemale from "@/assets/images/placeholder-female.png";
import { useEffect, useState } from "react";
import { SingleSegmentOutput, StoryGraph } from "@/lib/endpoints/storyStart";
import { OptionDialog } from "./optionDialog";

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

  const onNextCLick = () => {
    if (showChoices) return;
    if (narrativeIndex < loadedSegments.narrative_content.length - 1) {
      setNarrativeIndex(narrativeIndex + 1);
    } else {
      setShowChoices(true);
    }
  };

  const onSelectOption = (option: string) => {
    const isSegmentLoaded = Object.keys(story.segments).includes(option);

    if (!isSegmentLoaded) {
      alert("This segment is not loaded yet.");
      return;
    }

    const nextSegmentId = loadedSegments.choices.find(
      (choice) => choice.next_segment_id === option
    )?.next_segment_id;

    if (nextSegmentId) {
      setLoadedSegments(story.segments[nextSegmentId]);
      setCurrentSceneId(nextSegmentId);
      setNarrativeIndex(0);
      setShowChoices(false);
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
        content={loadedSegments.narrative_content[narrativeIndex]}
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
      />
    </div>
  );
};
