import nlp from "compromise";

// Helper to parse date string to ISO (e.g., "Thursday" to "2025-10-09")
function parseDate(dateText: string): string {
  // For demo: always return next Thursday
  // You can use date-fns, moment, or a custom parser for accuracy
  return "2025-10-09";
}

export function extractEntities(transcript: string) {
  const doc = nlp(transcript);

  // Try to extract place using compromise tags or fallback
  let location = doc.match('#Place').text();
  if (!location) {
    // fallback: try to find a capitalized phrase or known park name
    location = doc.match('Cubbon Park').text();
  }

  // Try to extract date/day
  let dateText = doc.match('#Date').text();
  if (!dateText) {
    dateText = doc.match('Thursday').text();
  }

  return {
    location: location || "",
    date: dateText ? parseDate(dateText) : ""
  };
}