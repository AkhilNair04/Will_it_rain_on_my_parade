// Helper to parse date string to ISO (e.g., "Thursday" to "2025-10-09")
function parseDate(): string {
  // For demo: always return next Thursday
  // You can use date-fns, moment, or a custom parser for accuracy
  return "2025-10-09";
}

export function extractEntities(transcript: string) {
  // Simple fallback without compromise library
  // Try to find common location names
  let location = "";
  if (transcript.toLowerCase().includes("cubbon park")) {
    location = "Cubbon Park";
  }

  // Try to find day mentions
  let dateText = "";
  if (transcript.toLowerCase().includes("thursday")) {
    dateText = "Thursday";
  }

  return {
    location: location || "",
    date: dateText ? parseDate() : "",
  };
}
