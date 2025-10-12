import { useStoryStore } from "@/stores/storyStore";
import { Navigate } from "react-router";
import Backdrop from "@/assets/images/game-backdrop.webp";
import { Button } from "@/components/ui/button";
import { getBucketUrl } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CharacterSelectionDialog } from "./characterSelectionDialog";
import { Users } from "lucide-react";
import type { CharacterDto } from "@/lib/endpoints/characters";

const StoryDetailPage = () => {
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const selectedCharacters = useStoryStore((state) => state.selectedCharacters);
  const setSelectedCharacters = useStoryStore(
    (state) => state.setSelectedCharacters
  );
  const navigate = useNavigate();
  const [isStartingAdventure, setIsStartingAdventure] = useState(false);
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false);

  if (!selectedStory) {
    return <Navigate to="/story/start" />;
  }

  const hasRequiredCharacters = selectedCharacters.length === 10;

  const handleCharacterConfirm = (characters: CharacterDto[]) => {
    setSelectedCharacters(characters);
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
            <Button
              variant="outline"
              onClick={() => setIsCharacterDialogOpen(true)}
              className="font-poppins"
            >
              {hasRequiredCharacters
                ? "Change Characters"
                : "Select Characters"}
            </Button>
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
                You need to select 10 characters before starting the adventure.
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
    </div>
  );
};

export default StoryDetailPage;
