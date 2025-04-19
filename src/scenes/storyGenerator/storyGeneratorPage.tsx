import { useStoryGenerator } from "@/lib/hooks/useStoryGenerator";
import { useState, useRef, useEffect } from "react";
import { StartingScene } from "../loading/starting";
import { StoryGeneratorScreen } from "./storyGeneratorScreen";

const StoryGeneratorPage = () => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const {
    data: storyGeneratorData,
    isLoading: isStoryGeneratorLoading,
    isError: isStoryGeneratorError,
    refetch: refetchStoryGenerator,
    isFetching: isStoryGeneratorFetching,
    isPending: isStoryGeneratorPending,
  } = useStoryGenerator();

  const startProgressSimulation = () => {
    console.log("Starting simulation...");
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 95;
        }

        let increment;
        if (prev < 30) {
          increment = Math.random() * 8 + 5;
        } else if (prev < 60) {
          increment = Math.random() * 5 + 3;
        } else if (prev < 85) {
          increment = Math.random() * 2 + 1;
        } else {
          increment = Math.random() * 1 + 0.5;
        }

        return Math.min(prev + increment, 95);
      });
    }, 400);
  };

  const stopProgressSimulation = (isSuccess = true) => {
    console.log(`Stopping simulation (Success: ${isSuccess})...`);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isSuccess) {
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
      }, 500);
    } else {
      setProgress(0);
    }
  };

  useEffect(() => {
    if (isStoryGeneratorLoading) startProgressSimulation();

    if (!isStoryGeneratorLoading && intervalRef.current)
      stopProgressSimulation(!isStoryGeneratorError);

    return () => {
      if (intervalRef.current) {
        console.log("Cleaning up interval on unmount/effect re-run");
        clearInterval(intervalRef.current);
      }
    };
  }, [isStoryGeneratorLoading, isStoryGeneratorError]);

  const showProgressBar =
    isStoryGeneratorLoading ||
    (progress === 100 &&
      !isStoryGeneratorLoading &&
      !isStoryGeneratorError &&
      !storyGeneratorData);

  return showProgressBar ? (
    <StartingScene value={progress} />
  ) : (
    <StoryGeneratorScreen
      data={storyGeneratorData ?? []}
      refresh={refetchStoryGenerator}
      isRefreshing={isStoryGeneratorFetching && !isStoryGeneratorPending}
    />
  );
};

export default StoryGeneratorPage;
