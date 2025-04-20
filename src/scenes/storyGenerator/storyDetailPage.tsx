import { useStoryStore } from "@/stores/storyStore";
import { Navigate } from "react-router";
import Backdrop from "@/assets/images/game-backdrop.webp";
import { Button } from "@/components/ui/button";
import { getBucketUrl } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router";

const StoryDetailPage = () => {
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const navigate = useNavigate();
  const [isStartingAdventure, setIsStartingAdventure] = useState(false);

  if (!selectedStory) {
    return <Navigate to="/story/start" />;
  }

  const handleStartAdventure = () => {
    setIsStartingAdventure(true);

    // In a real implementation, you would:
    // 1. Initialize game state
    // 2. Set up characters
    // 3. Navigate to the adventure screen

    // Simulate a loading period, then navigate to adventure page
    setTimeout(() => {
      navigate("/story/adventure");
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

        {/* Fixed buttons area */}
        <div className="flex justify-between p-6 border-t border-gray-700 ">
          <Button
            onClick={handleBack}
            variant="outline"
            className="text-gray-700 cursor-pointer"
          >
            Back to Selection
          </Button>

          <Button
            onClick={handleStartAdventure}
            disabled={isStartingAdventure}
            className="bg-amber-600 hover:bg-amber-700 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            {isStartingAdventure ? "Starting Adventure..." : "Start Adventure"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
