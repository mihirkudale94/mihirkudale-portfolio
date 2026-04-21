import { useState, useRef, useCallback, useEffect } from "react";

export function useAudio() {
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAudioId(null);
  }, []);

  const handlePlayAudio = useCallback(
    async (msgId, text) => {
      if (playingAudioId === msgId) {
        handleStopAudio();
        return;
      }

      handleStopAudio();

      try {
        setPlayingAudioId(msgId);

        const cleanText = text.replace(/[*#`_~]/g, "").trim();

        // 10s timeout so a hung request doesn't block the UI
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleanText }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch audio stream");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setPlayingAudioId(null);
          URL.revokeObjectURL(url);
        };

        audio.onerror = () => {
          setPlayingAudioId(null);
          URL.revokeObjectURL(url);
        };

        await audio.play();
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to play audio:", err);
        }
        setPlayingAudioId(null);
      }
    },
    [playingAudioId, handleStopAudio]
  );

  return { playingAudioId, handlePlayAudio, handleStopAudio };
}
