import { useState, useCallback, useEffect, useRef } from "react";

export function useAudio() {
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const utteranceRef = useRef(null);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleStopAudio = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setPlayingAudioId(null);
  }, []);

  const handlePlayAudio = useCallback(
    (msgId, text) => {
      if (!window.speechSynthesis) return;

      // Toggle off if already playing this message
      if (playingAudioId === msgId) {
        handleStopAudio();
        return;
      }

      handleStopAudio();

      const cleanText = text.replace(/[*#`_~[\]()]/g, "").trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Pick a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith("en") && v.localService && !v.name.includes("Zira")
      ) || voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);

      utteranceRef.current = utterance;
      setPlayingAudioId(msgId);
      window.speechSynthesis.speak(utterance);
    },
    [playingAudioId, handleStopAudio]
  );

  return { playingAudioId, handlePlayAudio, handleStopAudio };
}
