import { useMutation } from "@tanstack/react-query";
import Request from "@/lib/http";
import { normalizeSegmentsMap } from "@/lib/utils";
import { MusicTrack, SingleSegmentOutput } from "../endpoints/story";
import { storyService } from "../storyStore";

// API request structure based on documentation
interface ContinueStoryRequest {
  conversationHistory: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  currentSegmentId: string;
  choiceId: string;
  nextSegmentId: string;
  flowHistory?: string[];
}

interface ContinueStoryResponse {
  segments: {
    [segmentId: string]: SingleSegmentOutput;
  };
  music_tracks?: Record<string, MusicTrack>;
  success: boolean;
}

// Function to call the continue story API
const continueStoryAPI = async (
  data: ContinueStoryRequest
): Promise<ContinueStoryResponse> => {
  const payload = {
    ...data,
    flowHistory: data.flowHistory ?? storyService.getFlowHistory(),
  };
  const res = await Request<ContinueStoryResponse>({
    method: "post",
    url: "/api/story/continue-scene",
    data: payload,
  });

  return res.data;
};

export const useContinueStory = () => {
  return useMutation({
    mutationFn: continueStoryAPI,
    onSuccess: (data) => {
      console.log("Story continuation successful:", data);
      const normalized = normalizeSegmentsMap(data.segments);
      storyService.addSegments(normalized);
      storyService.addApiMessage("assistant", JSON.stringify(data));
    },
    onError: (error: Error) => {
      console.error("Story continuation failed:", error);
    },
  });
};

// Export types for use in other components
export type { ContinueStoryRequest, ContinueStoryResponse };
