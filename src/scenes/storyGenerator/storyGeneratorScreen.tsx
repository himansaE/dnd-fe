import { storyGeneratorRes } from "@/lib/endpoints/storyGenarator";
import Backdrop from "@/assets/images/game-backdrop.webp";
import { Button } from "@/components/ui/button";
import { cn, getBucketUrl } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useStoryStore } from "@/stores/storyStore";
import { useNavigate } from "react-router";

type StoryGeneratorScreenProps = {
  data: storyGeneratorRes[];
  refresh: () => void;
  isRefreshing: boolean;
};

export const StoryGeneratorScreen = (props: StoryGeneratorScreenProps) => {
  // Get the story selection function from our store
  const selectStory = useStoryStore((state) => state.selectStory);
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const navigate = useNavigate();

  // Handle story selection
  const handleStorySelect = (story: storyGeneratorRes) => {
    selectStory(story);
    // After selecting a story, navigate to the story detail page
    // We'll implement this page next
    navigate("/story/detail");
  };

  return (
    <div
      className="flex flex-col gap-5 items-center min-h-screen bg-charcoal pt-16"
      style={{
        backgroundImage: `url(${Backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {props.isRefreshing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50 backdrop-blur-xl transition ">
          <div className="p-4 bg-black/40 rounded-full animate-spin">
            <RefreshCcw size="32" color="white" />
          </div>
        </div>
      )}
      <p className="text-white text-3xl relative z-50">Select a scenario</p>

      <div className="flex gap-x-10 px-14 font-poppins pt-8">
        {props.data.map((story, index) => (
          <div
            key={index}
            className={cn(
              "grid-cols-3 gap-4 h-[430px] rounded-2xl max-w-[320px] bg-white p-4 flex flex-col shadow-lg cursor-pointer transition-transform duration-300 ease-in-out",
              "hover:scale-105 hover:shadow-2xl text-white relative border-gradient-btn-end border-3 overflow-hidden bg-cover bg-center",
              index === 1 && "-translate-y-8",
              selectedStory?.title === story.title && "ring-4 ring-amber-400"
            )}
            style={{
              backgroundImage: `url(${getBucketUrl(story.card_background)})`,
            }}
            onClick={() => handleStorySelect(story)}
          >
            <h2 className="text-xl font-bold mt-auto relative z-10">
              {story.title}
            </h2>
            <p className="line-clamp-4 text-sm relative z-10">
              {story.hidden_description}
            </p>
            <div className="bg-gradient-to-t from-gradient-box-end to-transparent absolute bottom-0 h-72  w-full -translate-x-4" />
          </div>
        ))}
      </div>

      <Button onClick={props.refresh}>REFRESH</Button>
    </div>
  );
};
