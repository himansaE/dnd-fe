import { useStoryStore } from "@/stores/storyStore";
import { Navigate } from "react-router";
import Backdrop from "@/assets/images/game-backdrop.webp";
import { Button } from "@/components/ui/button";
import { getBucketUrl } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CharacterSelectionDialog } from "./characterSelectionDialog";
import { AutoSelectModal } from "./autoSelectModal";
import { Users, Sparkles } from "lucide-react";
import type { CharacterDto } from "@/lib/endpoints/characters";
import { useAutoSelectCharacters } from "@/lib/hooks/useCharacters";

const StoryDetailPage = () => {
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const selectedCharacters = useStoryStore((state) => state.selectedCharacters);
  const setSelectedCharacters = useStoryStore(
    (state) => state.setSelectedCharacters
  );
  const navigate = useNavigate();
  const [isStartingAdventure, setIsStartingAdventure] = useState(false);
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false);
  const [isAutoSelectModalOpen, setIsAutoSelectModalOpen] = useState(false);
  const [autoSelectResult, setAutoSelectResult] = useState<{
    characters: CharacterDto[];
    analysis: any[];
    strategy: string;
  } | null>(null);

  const autoSelectMutation = useAutoSelectCharacters();

  if (!selectedStory) {
    return <Navigate to="/story/start" />;
  }

  const hasRequiredCharacters =
    selectedCharacters.length >= 10 && selectedCharacters.length <= 30;

  const handleCharacterConfirm = (characters: CharacterDto[]) => {
    setSelectedCharacters(characters);
  };

  const handleAutoSelect = async () => {
    if (!selectedStory) return;

    setIsAutoSelectModalOpen(true);
    setAutoSelectResult(null);

    try {
      const result = await autoSelectMutation.mutateAsync({
        title: selectedStory.title,
        description: selectedStory.hidden_description,
        plot: selectedStory.plot,
      });

      console.log(
        `[StoryDetailPage] AI selected ${result.characters.length} characters`
      );
      setAutoSelectResult(result);
    } catch (error) {
      console.error("[StoryDetailPage] Auto-select failed:", error);
      // Error is handled by the modal
    }
  };

  const handleAutoSelectConfirm = () => {
    if (autoSelectResult) {
      // Use all AI-selected characters (already 10-15 from backend)
      const charactersToUse = autoSelectResult.characters;
      console.log(
        `[StoryDetailPage] Using ${charactersToUse.length} AI-selected characters`
      );
      setSelectedCharacters(charactersToUse);
      setIsAutoSelectModalOpen(false);
      setAutoSelectResult(null);
      autoSelectMutation.reset();
    }
  };

  const handleAutoSelectCancel = () => {
    setIsAutoSelectModalOpen(false);
    setAutoSelectResult(null);
    autoSelectMutation.reset();
    // Open manual selection dialog after closing auto-select modal
    setTimeout(() => {
      setIsCharacterDialogOpen(true);
    }, 100);
  };

  const handleStartAdventure = () => {
    if (!hasRequiredCharacters) {
      // Open character selection if not already selected
      setIsCharacterDialogOpen(true);
      return;
    }

    console.log(
      "[StoryDetailPage] Starting adventure with characters:",
      selectedCharacters.map((c) => c.name)
    );

    setIsStartingAdventure(true);

    // Navigate to adventure page with selected characters
    setTimeout(() => {
      navigate("/story/play");
    }, 1500);
  };

  const handleBack = () => {
    navigate("/story/start");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-charcoal p-8 overflow-hidden"
      style={{
        backgroundImage: `url(${Backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // Fixed height for the container
      }}
    >
      <div
        className="max-w-4xl w-full bg-black/60 rounded-xl text-white backdrop-blur-sm flex flex-col"
        style={{
          maxHeight: "85vh", // Limit the height to leave some space at top and bottom
        }}
      >
        {/* Scrollable content area with custom scrollbar */}
        <div
          className="overflow-y-auto p-8 flex-1 custom-scrollbar"
          style={{
            paddingRight: "24px", // Extra padding to prevent content from touching scrollbar
            scrollbarGutter: "stable",
          }}
        >
          <h1 className="text-4xl font-bold mb-6 text-amber-400">
            {selectedStory.title}
          </h1>

          <div className="mb-8 flex flex-col md:flex-row gap-6">
            <div
              className="w-full md:w-1/3 h-64 bg-cover bg-center rounded-lg shadow-lg"
              style={{
                backgroundImage: `url(${getBucketUrl(
                  selectedStory.card_background
                )})`,
              }}
            ></div>

            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-semibold mb-4 font-poppins">
                Adventure Description
              </h2>
              <p className="mb-6 font-poppins">
                {selectedStory.hidden_description}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 font-poppins">
              Plot Overview
            </h2>
            <p className="whitespace-pre-lin font-poppins">
              {selectedStory.plot}
            </p>
          </div>
        </div>

        {/* Character Selection Section */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="text-amber-400" size={20} />
              <h3 className="text-lg font-semibold font-poppins text-white">
                Adventure Party
              </h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleAutoSelect}
                disabled={
                  autoSelectMutation.isPending ||
                  isStartingAdventure ||
                  isAutoSelectModalOpen
                }
                className="font-poppins text-base"
              >
                <Sparkles className="mr-2" size={16} />
                Auto Select Characters
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCharacterDialogOpen(true)}
                disabled={isStartingAdventure || isAutoSelectModalOpen}
                className="font-poppins text-base"
              >
                {hasRequiredCharacters
                  ? "Change Characters"
                  : "Select Characters"}
              </Button>
            </div>
          </div>
          <div className="text-sm font-poppins">
            {hasRequiredCharacters ? (
              <div className="flex flex-wrap gap-2">
                {selectedCharacters.map((char) => (
                  <span
                    key={char.id}
                    className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-[#7a3b9e] to-[#5a2b72] rounded-md border border-[#9361B0] text-white text-xs"
                  >
                    {char.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white/60">
                You need to select 10-30 characters before starting the
                adventure.
              </p>
            )}
          </div>
        </div>

        {/* Fixed buttons area */}
        <div className="flex justify-between p-6 border-t border-gray-700 ">
          <Button onClick={handleBack} variant="outline">
            Back to Selection
          </Button>

          <Button
            onClick={handleStartAdventure}
            disabled={isStartingAdventure || !hasRequiredCharacters}
          >
            {isStartingAdventure
              ? "Starting Adventure..."
              : hasRequiredCharacters
              ? "Start Adventure"
              : selectedCharacters.length > 0
              ? `Select ${Math.max(
                  0,
                  10 - selectedCharacters.length
                )} More Characters`
              : "Select Characters First"}
          </Button>
        </div>
      </div>

      <CharacterSelectionDialog
        open={isCharacterDialogOpen}
        onOpenChange={setIsCharacterDialogOpen}
        selectedCharacters={selectedCharacters}
        onConfirm={handleCharacterConfirm}
      />

      <AutoSelectModal
        open={isAutoSelectModalOpen}
        isLoading={autoSelectMutation.isPending}
        characters={autoSelectResult?.characters || null}
        analysis={autoSelectResult?.analysis || null}
        strategy={autoSelectResult?.strategy || null}
        error={autoSelectMutation.error?.message || null}
        onConfirm={handleAutoSelectConfirm}
        onCancel={handleAutoSelectCancel}
      />
    </div>
  );
};

export default StoryDetailPage;
