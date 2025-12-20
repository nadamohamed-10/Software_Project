// Simple deterministic name mapping for consistent transliterations

export const nameMap: Record<string, string> = {
  "John Doe": "Ahmed Nabil",
  "Alice Smith": "Amina Hassan",
  "Michael Johnson": "Mohamed Youssef",
  "Sarah Connor": "Sara Nabil",
};

/**
 * Translate a single full name if it exactly matches a key in the map.
 * Returns the original name when no mapping exists.
 */
export function translateName(name: string): string {
  return nameMap[name] ?? name;
}

/**
 * Replace mapped names inside a longer text. Matches whole-word occurrences.
 */
export function replaceNamesInText(text: string): string {
  return Object.entries(nameMap).reduce((acc, [from, to]) => {
    // Escape regex chars
    const esc = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${esc}\\b`, "g");
    return acc.replace(regex, to);
  }, text);
}
