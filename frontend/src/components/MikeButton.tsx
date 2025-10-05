import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceProcessor } from '../hooks/useVoiceProcessor';
import type { BackendPayload } from '../hooks/useVoiceProcessor';

export const MikeButton: React.FC<{ onResult?: (payload: BackendPayload) => void }> = ({ onResult }) => {
  const { isListening, transcript, error, startListening } = useVoiceProcessor();
  const [backendResponse, setBackendResponse] = useState<any | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [voiceEnabled] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const postToBackend = async (payload: BackendPayload) => {
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
    }
  };

  // Manual speak function (useful if automatic speech is blocked by browser policies)
  const speakSummary = (resp = backendResponse) => {
    if (!resp) return;
    const utteranceText = buildSpokenSummary(resp);
    if (!utteranceText) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(utteranceText);
      utter.lang = 'en-US';
      utter.rate = 1;
      utter.pitch = 1;
      synth.cancel();
      synth.speak(utter);
    } catch (e) {
      console.warn('Speech synth failed', e);
    }
  };

  // Build a concise spoken summary using only the fields shown in the summary card
  const buildSpokenSummary = (resp: any) => {
    if (!resp) return '';

    const loc = resp.input_location?.name || resp.city || '';
    const date = resp.input_location?.forecast_date || resp.date || '';
    const rainMm = resp.prediction_output?.predicted_rainfall_mm ?? resp.predicted_rainfall_mm;
    const rainOutlook = resp.prediction_output?.rain_outlook ?? resp.rain_outlook;
    const temp = resp.prediction_output?.temperature_outlook ?? resp.temperature_outlook;
    const wind = resp.prediction_output?.wind_outlook ?? resp.wind_outlook;
    const erosion = resp.prediction_output?.erosion_risk ?? resp.erosion_risk;
    const pop = resp.live_forecast_values?.api_pop_percent ?? resp.api_pop_percent;
    const finalSummary = resp.prediction_output?.final_summary || '';

    const parts: string[] = [];
    if (loc) parts.push(loc + (date ? ` on ${date}` : ''));
    if (rainOutlook || rainMm != null) {
      const mmText = rainMm != null ? `${rainMm} mm` : '';
      parts.push(`${rainOutlook ?? ''}${mmText ? ' (' + mmText + ')' : ''}`.trim());
    }
    if (finalSummary) parts.push(finalSummary);
    if (temp) parts.push(`Temperature: ${temp}`);
    if (wind) parts.push(`Wind: ${wind}`);
    if (erosion) parts.push(`Erosion risk: ${erosion}`);
    if (pop != null) parts.push(`POP ${pop}%`);

    // Join into a short paragraph; do not read raw JSON
    return parts.join('. ').replace(/\s+/g, ' ').trim();
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
  {/* loading indicator intentionally removed per UX request */}
      {backendError && <p className="text-sm text-rose-400 mt-2">{backendError}</p>}
      {backendResponse && (
        <div className="w-full mt-3">
          {/* Summary Card */}
          <div className="bg-white/5 p-4 rounded-md shadow-sm text-left">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-semibold">{backendResponse.input_location?.name || backendResponse.city || 'Location'}</h3>
                <p className="text-sm text-gray-300">{backendResponse.input_location?.forecast_date || backendResponse.date || ''}</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-white font-bold">{backendResponse.prediction_output?.predicted_rainfall_mm ?? backendResponse.predicted_rainfall_mm ?? '-'} mm</p>
                <p className="text-sm text-gray-300">{backendResponse.prediction_output?.rain_outlook ?? backendResponse.rain_outlook ?? ''}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div>
                <div className="font-medium text-white">Temp</div>
                <div>{backendResponse.prediction_output?.temperature_outlook ?? backendResponse.temperature_outlook ?? '-'}</div>
              </div>
              <div>
                <div className="font-medium text-white">Wind</div>
                <div>{backendResponse.prediction_output?.wind_outlook ?? backendResponse.wind_outlook ?? '-'}</div>
              </div>
              <div>
                <div className="font-medium text-white">Erosion Risk</div>
                <div>{backendResponse.prediction_output?.erosion_risk ?? backendResponse.erosion_risk ?? '-'}</div>
              </div>
              <div>
                <div className="font-medium text-white">POP</div>
                <div>{backendResponse.live_forecast_values?.api_pop_percent ?? backendResponse.api_pop_percent ?? '-'}%</div>
              </div>
            </div>

            {backendResponse.prediction_output?.final_summary && (
              <p className="text-sm text-gray-200 mt-3">{backendResponse.prediction_output.final_summary}</p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDetails((s) => !s)}
                  className="text-sm text-white/90 bg-white/10 hover:bg-white/20 px-3 py-1 rounded"
                >
                  {showDetails ? 'Hide details' : 'Show details'}
                </button>
                <button
                  onClick={() => speakSummary()}
                  className="text-sm text-white/90 bg-white/10 hover:bg-white/20 px-3 py-1 rounded"
                >
                  Replay
                </button>
              </div>
              <div className="text-xs text-gray-400">Updated from backend</div>
            </div>
          </div>

          {showDetails && (
            <pre className="text-xs text-gray-200 mt-2 p-2 bg-white/5 rounded max-w-full overflow-x-auto">
              {JSON.stringify(backendResponse, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
