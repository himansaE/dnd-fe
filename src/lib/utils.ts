import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const joinUrl = (...urlParts: string[]): string => {
  if (!urlParts || urlParts.length === 0) {
    return "";
  }

  const nonEmptyParts = urlParts.filter((part) => part != null && part !== "");
  if (nonEmptyParts.length === 0) {
    return "";
  }

  // Handle the first part separately to preserve protocol
  let firstPart = nonEmptyParts[0];
  const remainingParts = nonEmptyParts.slice(1);

  // Trim trailing slash from the first part, unless it's the only part and just '/' or includes '://'
  if (
    remainingParts.length > 0 &&
    firstPart.endsWith("/") &&
    firstPart !== "/" &&
    !firstPart.includes("://")
  ) {
    firstPart = firstPart.slice(0, -1);
  } else if (firstPart.endsWith("://")) {
    // Avoid trimming if it's just the protocol like 'http://'
    firstPart = firstPart.slice(0, -1); // Keep 'http:/' temporarily
  }

  const processedParts = remainingParts.map((part) => {
    // Trim leading and trailing slashes from middle parts
    return part.replace(/^\/+/, "").replace(/\/+$/, "");
  });

  // REMOVED: // Reconstruct the URL
  const joined = [firstPart, ...processedParts].join("/");

  // Special case: Correct double slashes after protocol if firstPart was only protocol
  // e.g. http:/ + /path -> http://path
  return joined.replace(/(:\/)\/+/g, "$1/");
};
export const getBucketUrl = (fileName: string) => {
  return `${import.meta.env.VITE_S3_BUCKET_URL}/${fileName}`;
};

// --- Story normalization helpers ---
type NarrativeItem =
  | { type: "narrator"; text: string }
  | { type: "character"; name: string; dialogue: string };

export const normalizeNarrativeItem = (item: any): NarrativeItem => {
  if (!item || typeof item !== "object") {
    return { type: "narrator", text: "" };
  }
  if (item.type === "character") {
    const name = item.name ?? item.speaker ?? "";
    const dialogue = item.dialogue ?? item.text ?? "";
    return { type: "character", name, dialogue };
  }
  // default to narrator
  const text = item.text ?? item.dialogue ?? "";
  return { type: "narrator", text };
};

export const normalizeSegment = (segment: any) => {
  const narrative = Array.isArray(segment?.narrative_content)
    ? segment.narrative_content.map(normalizeNarrativeItem)
    : [];
  const choices = Array.isArray(segment?.choices)
    ? segment.choices.map((c: any) => ({
        text: String(c?.text ?? ""),
        next_segment_id: String(c?.next_segment_id ?? ""),
      }))
    : [];
  return { narrative_content: narrative, choices };
};

export const normalizeSegmentsMap = (segments: any) => {
  const map = segments?.segments ?? segments ?? {};
  const result: Record<string, any> = {};
  Object.keys(map).forEach((key) => {
    result[key] = normalizeSegment(map[key]);
  });
  return result;
};
