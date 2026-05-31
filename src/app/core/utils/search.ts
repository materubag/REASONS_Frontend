/**
 * Normalizes a string by converting it to lowercase and removing accents/diacritics.
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Performs a flexible search match against multiple target fields.
 * Strips accents, ignores casing, and splits the search term into words,
 * ensuring all search words are found in the combined fields text.
 */
export function flexibleSearchMatch(fields: (string | undefined | null)[], searchTerm: string): boolean {
  if (!searchTerm || !searchTerm.trim()) {
    return true;
  }

  const normalizedTerm = normalizeString(searchTerm).trim();
  if (!normalizedTerm) {
    return true;
  }

  // Split by whitespace to check for individual words
  const searchWords = normalizedTerm.split(/\s+/);

  // Combine and normalize all non-null fields
  const combinedText = fields
    .map(f => (f ? normalizeString(f) : ""))
    .join(" ");

  // All search words must be present in the combined target fields text
  return searchWords.every(word => combinedText.includes(word));
}
