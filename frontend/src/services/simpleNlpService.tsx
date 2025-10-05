// src/services/simpleNlpService.ts

export interface ExtractedEntities {
  location: string | null;
  date: string | null; // Date in YYYY-MM-DD format
}

/**
 * A simple function to extract location and date from a text string.
 * NOTE: This is a basic implementation. For more complex phrases,
 * a robust NLP service like Dialogflow would be more reliable.
 * @param text - The transcribed text from the user's voice.
 * @returns An object containing the extracted location and date.
 */
export const extractEntities = (text: string): ExtractedEntities => {
  const lowerText = text.toLowerCase();
  let location: string | null = null;
  let date: string | null = null;

  // --- Location Extraction (simple keyword-based) ---
  // Looks for phrases like "visit [location]" or "in [location]"
  const locationMatch = lowerText.match(/(?:visit|in|at|to)\s(.+?)(?:\s(?:on|be ideal|tomorrow|today)|$)/);
  if (locationMatch && locationMatch[1]) {
    // Capitalize the first letter of each word
    location = locationMatch[1].replace(/\b\w/g, char => char.toUpperCase());
  }

  // --- Date Extraction (simple keyword-based) ---
  const now = new Date();
  if (lowerText.includes("tomorrow")) {
    now.setDate(now.getDate() + 1);
    date = now.toISOString().split('T')[0];
  } else if (lowerText.includes("today")) {
    date = now.toISOString().split('T')[0];
  } else {
    // Simple check for days of the week
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (let i = 0; i < days.length; i++) {
      if (lowerText.includes(days[i])) {
        const today = now.getDay();
        const targetDay = i;
        const dayDifference = (targetDay - today + 7) % 7;
        now.setDate(now.getDate() + (dayDifference === 0 ? 7 : dayDifference)); // Assume next week's day
        date = now.toISOString().split('T')[0];
        break;
      }
    }
  }

  return { location, date };
};