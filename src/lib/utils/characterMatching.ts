import type { CharacterDto } from "../endpoints/characters";

/**
 * Finds a character by ID (exact match) or name (fuzzy match fallback)
 */
export function findCharacterMatch(
  characters: CharacterDto[],
  characterId?: string,
  characterName?: string
): CharacterDto | null {
  // Priority 1: Exact ID match
  if (characterId) {
    const exactMatch = characters.find((c) => c.id === characterId);
    if (exactMatch) {
      console.log(
        `[characterMatching] Exact ID match: ${exactMatch.name} (${exactMatch.id})`
      );
      return exactMatch;
    }
  }

  // Priority 2: Fuzzy name match
  if (characterName) {
    const normalized = characterName.toLowerCase().trim();

    // Try exact name match first
    const exactNameMatch = characters.find(
      (c) => c.name.toLowerCase().trim() === normalized
    );
    if (exactNameMatch) {
      console.log(
        `[characterMatching] Exact name match: ${exactNameMatch.name}`
      );
      return exactNameMatch;
    }

    // Try partial match (character name contains search or vice versa)
    const partialMatch = characters.find(
      (c) =>
        c.name.toLowerCase().includes(normalized) ||
        normalized.includes(c.name.toLowerCase())
    );
    if (partialMatch) {
      console.log(
        `[characterMatching] Partial name match: ${partialMatch.name} for "${characterName}"`
      );
      return partialMatch;
    }

    // Try similarity scoring for typos
    const similarityScores = characters.map((c) => ({
      character: c,
      score: calculateSimilarity(c.name.toLowerCase(), normalized),
    }));

    const bestMatch = similarityScores.reduce((best, current) =>
      current.score > best.score ? current : best
    );

    if (bestMatch.score > 0.6) {
      console.log(
        `[characterMatching] Fuzzy match: ${bestMatch.character.name} (score: ${bestMatch.score}) for "${characterName}"`
      );
      return bestMatch.character;
    }
  }

  console.warn(
    `[characterMatching] No match found for ID: ${characterId}, Name: ${characterName}`
  );
  return null;
}

/**
 * Simple Levenshtein-based similarity (normalized to 0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

