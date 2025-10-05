import { useState, useRef, useCallback } from 'react';
import { getCoordinates } from '../services/geocodingService';
import { extractEntities } from '../services/simpleNlpService';

// Exporting this interface so other components can use it
export interface BackendPayload {
  city: string;
  latitude: number;
  longitude: number;
  date: string;
  start_hour: number;
  end_hour: number;
}

// Internal types
interface SpeechRecognitionEvent extends Event {
  results: { 0: { 0: { transcript: string } } };
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Corrected: Using a named export for consistency
export const useVoiceProcessor = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const processTranscript = useCallback(async (text: string): Promise<BackendPayload | null> => {
    // ... (rest of the processing logic is correct and remains unchanged) ...
    console.log("Step 1: Received transcript ->", text);
    let { location, date } = extractEntities(text);
    console.log("Step 2: Initial entities from service ->", { location, date });

    if (!location && date) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'today', 'tomorrow'];
        const lowerText = text.toLowerCase();
        
        for (const day of days) {
            const dayIndex = lowerText.lastIndexOf(day);
            if (dayIndex > 0) {
                let potentialLocation = text.substring(0, dayIndex).trim();
                potentialLocation = potentialLocation.replace(/\s+on$/i, '').trim();
                
                if (potentialLocation) {
                  location = potentialLocation.replace(/\b\w/g, char => char.toUpperCase());
                  console.log("Step 2.1: Fallback logic found location ->", location);
                  break;
                }
            }
        }
    }
    
    if (location) {
        const dateWords = ['today', 'tomorrow', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        if (dateWords.includes(location.toLowerCase())) {
            console.log(`Step 2.4: Discarding location "${location}" because it's a date word.`);
            location = null;
        }
    }

    console.log("Step 2.5: Final Cleaned Location ->", location);

    if (!location || !date) {
      setError("Could not understand the location or date. Please try again.");
      return null;
    }

    const coordinates = await getCoordinates(location);
    console.log("Step 3: Found Coordinates ->", coordinates);

    if (!coordinates) {
      setError(`Could not find coordinates for "${location}".`);
      return null;
    }

    // --- FIX: Renamed 'forecast_date' to 'date' to match common backend expectations ---
    return {
      city: location,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      date: date, // Changed key name
      start_hour: 8,
      end_hour: 20,
    };
  }, []);

  const startListening = useCallback((onResult: (payload: BackendPayload) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setError(null);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => setError(`Recognition error: ${event.error}`);
    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      const payload = await processTranscript(currentTranscript);
      if (payload) {
        onResult(payload);
      }
    };
    recognition.start();
  }, [processTranscript]);

  return { isListening, transcript, error, startListening };
};

