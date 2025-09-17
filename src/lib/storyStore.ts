import { SingleSegmentOutput } from "./endpoints/story";

export interface PlayerHistoryNarrativeItem {
  type: "narrative";
  text: string;
}

export interface PlayerHistoryChoiceItem {
  type: "choice";
  text: string;
}

// Union type for any item in the player's journey history log
export type PlayerHistoryItem =
  | PlayerHistoryNarrativeItem
  | PlayerHistoryChoiceItem;
interface ChatCompletionMessageParam {
  role: "system" | "user" | "assistant";
  content: string;
}

class StoryService {
  private loadedSegments: { [segmentId: string]: SingleSegmentOutput } = {};
  private segmentHistory: string[] = []; // For UI history
  private apiMessageHistory: ChatCompletionMessageParam[] = []; // For API calls
  private flowHistory: string[] = [];

  addSegment(segmentId: string, segment: SingleSegmentOutput) {
    this.loadedSegments[segmentId] = segment;
  }

  addSegments(segments: { [segmentId: string]: SingleSegmentOutput }) {
    this.loadedSegments = { ...this.loadedSegments, ...segments };
  }

  getSegment(segmentId: string) {
    return this.loadedSegments[segmentId];
  }

  getAllSegments() {
    return this.loadedSegments;
  }

  getSegmentHistory() {
    return this.segmentHistory;
  }

  addSegmentToHistory(segmentId: string) {
    this.segmentHistory.push(segmentId);
  }

  getApiMessageHistory() {
    return this.apiMessageHistory;
  }

  addApiMessage(role: "system" | "user" | "assistant", content: string) {
    this.apiMessageHistory.push({ role, content });
  }

  getFlowHistory() {
    return this.flowHistory;
  }

  setFlowHistory(history: string[]) {
    this.flowHistory = Array.isArray(history) ? history : [];
  }

  addFlowStep(step: string) {
    this.flowHistory.push(step);
  }

  reset() {
    this.loadedSegments = {};
    this.segmentHistory = [];
    this.apiMessageHistory = [];
    this.flowHistory = [];
  }
}

export const storyService = new StoryService();
