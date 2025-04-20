import { useStoryStore } from "@/stores/storyStore";
import { Navigate } from "react-router";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const AdventurePage = () => {
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const navigate = useNavigate();

  // If no story is selected, redirect to story selection
  if (!selectedStory) {
    return <Navigate to="/story/start" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{selectedStory.title}</h1>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Adventure Log</h2>
          <div className="h-64 overflow-y-auto bg-gray-700 p-4 rounded-lg">
            <p>Your adventure begins in a mysterious land...</p>
            <p className="mt-4">
              The story of {selectedStory.title} unfolds before you...
            </p>
            {/* Future adventure logs would be displayed here */}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Character Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button>Explore the area</Button>
            <Button>Talk to NPCs</Button>
            <Button>Check inventory</Button>
            <Button>Rest</Button>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/story/detail")}
          className="mt-4"
        >
          Back to Story Details
        </Button>
      </div>
    </div>
  );
};

export default AdventurePage;
