import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceProcessor } from '../hooks/useVoiceProcessor';
import type { BackendPayload } from '../hooks/useVoiceProcessor';

export const MikeButton: React.FC<{ onResult?: (payload: BackendPayload) => void }> = ({ onResult }) => {
  const { isListening, transcript, error, startListening } = useVoiceProcessor();
  const [loading, setLoading] = useState(false);
  const [backendResponse, setBackendResponse] = useState<any | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [voiceEnabled] = useState(true);

  const postToBackend = async (payload: BackendPayload) => {
    setLoading(true);
    setBackendError(null);
    setBackendResponse(null);
    try {
      const res = await fetch('http://localhost:5000/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }
      const data = await res.json();
      setBackendResponse(data);
    } catch (e: any) {
      setBackendError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  // Build a human-friendly spoken summary from backend response
  const buildSpokenSummary = (resp: any) => {
    if (!resp) return '';
    // If backend provides a human summary, prefer it
    if (typeof resp.summary === 'string' && resp.summary.trim()) return resp.summary;
    if (typeof resp.advice === 'string' && resp.advice.trim()) return resp.advice;

    // If there's a probability_of_rain field, use it
    if (typeof resp.probability_of_rain === 'number') {
      const pct = Math.round(resp.probability_of_rain * 100);
      const hours = resp.peak_hours ? `between ${resp.peak_hours.start} and ${resp.peak_hours.end}` : '';
      return `There is a ${pct} percent chance of rain ${hours}. ${resp.city ? 'Location: ' + resp.city + '.' : ''}`.trim();
    }

    // Fallback: stringify a few known fields
    const parts: string[] = [];
    if (resp.city) parts.push(`Location ${resp.city}`);
    if (resp.date) parts.push(`for ${resp.date}`);
    if (resp.condition) parts.push(resp.condition);
    if (parts.length) return parts.join(', ') + '.';

    // Last resort: read the JSON's keys and short values
    try {
      return 'Weather update: ' + JSON.stringify(resp).slice(0, 400);
    } catch {
      return 'Weather update received.';
    }
  };

  // Speak backend response when it arrives (if enabled)
  useEffect(() => {
    if (!voiceEnabled || !backendResponse) return;
    const utteranceText = buildSpokenSummary(backendResponse);
    if (!utteranceText) return;

    try {
      const synth = window.speechSynthesis;
      if (!synth) return; // no speech support
      const utter = new SpeechSynthesisUtterance(utteranceText);
      // Optionally tweak voice/pitch/rate
      utter.lang = 'en-US';
      utter.rate = 1;
      utter.pitch = 1;
      synth.cancel(); // stop any ongoing speech
      synth.speak(utter);
    } catch (e) {
      // ignore speak errors; UI still shows JSON
      // eslint-disable-next-line no-console
      console.warn('Speech synth failed', e);
    }
  }, [backendResponse, voiceEnabled]);

  const handleClick = () => {
    startListening((payload) => {
      if (onResult) onResult(payload);
      else console.log('Voice payload:', payload);
      // Always attempt to send payload to backend
      postToBackend(payload);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md shadow-sm"
        aria-pressed={isListening}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        <span>{isListening ? 'Listening...' : 'Ask Mike'}</span>
      </button>
      {transcript && <p className="text-sm text-gray-300 mt-2">"{transcript}"</p>}
      {error && <p className="text-sm text-rose-400 mt-1">{error}</p>}
      {loading && <p className="text-sm text-yellow-300 mt-2">Sending to backend...</p>}
      {backendError && <p className="text-sm text-rose-400 mt-2">{backendError}</p>}
      {backendResponse && (
        <pre className="text-xs text-gray-200 mt-2 p-2 bg-white/5 rounded max-w-full overflow-x-auto">
          {JSON.stringify(backendResponse, null, 2)}
        </pre>
      )}
    </div>
  );
};
  