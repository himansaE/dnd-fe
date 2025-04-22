import { storyGeneratorRes } from "./storyGenarator";
import Request from "@/lib/http";

export type StoryBaseOptions = {
  scene: string;
  characters: Character[];
};

export type Character = {
  name: string;
  type: string;
  description: string;
  ability: string;
};
export interface NarratorContent {
  type: "narrator";
  text: string;
}

export interface CharacterContent {
  type: "character";
  name: string;
  dialogue: string;
}

export type NarrativeContentItem = NarratorContent | CharacterContent;

export interface ChoiceItem {
  text: string;
  next_segment_id: string;
}

export interface SingleSegmentOutput {
  narrative_content: NarrativeContentItem[];
  choices: ChoiceItem[];
}

export interface InitialSegmentOutput extends SingleSegmentOutput {
  story_title?: string;
  start_segment_id: string;
}

export interface StoryGraph {
  story_title?: string;
  start_segment_id: string;
  segments: {
    [segmentId: string]: SingleSegmentOutput;
  };
}

export interface StoryStartRes {
  storyBase: StoryBaseOptions;
  startScene: StoryGraph;
}

export const startScene = async (
  story: Omit<storyGeneratorRes, "card_background">
) => {
  const res = await Request<StoryStartRes>({
    method: "get",
    url: "/api/story/start-scene",
    params: {
      title: story.title,
      plot: story.plot,
      description: story.hidden_description,
    },
  });

  return res.data;
};
