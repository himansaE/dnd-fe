import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export const useLyriaMusic = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const volume = useSettingsStore((state) => state.volume);

  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      // Volume is 0-100, convert to 0-1
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Used to queue mood updates if WS is not ready yet
  const moodQueue = useRef<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const initAudio = async () => {
      try {
        // Create Audio Context
        // Note: Browsers require user interaction to resume AudioContext.
        // We use window.AudioContext to ensure type compatibility or fallback if needed
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({ sampleRate: 48000 });
        audioContextRef.current = ctx;

        console.log("[Lyria] Loading AudioWorklet...");
        // Load Worklet
        try {
          await ctx.audioWorklet.addModule("/pcm-processor.js");
          console.log("[Lyria] AudioWorklet loaded.");
        } catch (e) {
          console.error(
            "[Lyria] Failed to load /pcm-processor.js. Check public folder.",
            e
          );
          throw e;
        }

        // Create Worklet Node – guard against browsers/environments that don't fully support AudioWorklet
        let node: AudioWorkletNode;
        try {
          node = new AudioWorkletNode(ctx, "pcm-processor", {
            outputChannelCount: [2],
          });
        } catch (e) {
          console.error(
            "[Lyria] Failed to create AudioWorkletNode. Audio worklet may not be supported in this context.",
            e
          );
          return; // Bail out gracefully; WebSocket may still connect but audio won't play
        }
        workletNodeRef.current = node;

        // Create Gain Node
        const gainNode = ctx.createGain();
        gainNode.gain.value = useSettingsStore.getState().volume / 100;
        gainNodeRef.current = gainNode;

        // Connect to destination (speakers)
        node.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Connect WebSocket
        const wsUrl = "ws://localhost:3000/ws/music";
        const ws = new WebSocket(wsUrl);
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
          if (isMounted) {
            setIsConnected(true);
            console.log("[Lyria] Connected to Music Service");

            // Flush pending mood updates
            if (moodQueue.current.length > 0) {
              const pendingPrompt = moodQueue.current.shift(); // Take the first (or last?)
              // Let's just take the most recent one if multiple queued, but usually it's one
              if (pendingPrompt) {
                console.log("[Lyria] Flushing pending mood:", pendingPrompt);
                ws.send(
                  JSON.stringify({ type: "STEER", prompt: pendingPrompt })
                );
              }
              moodQueue.current = [];
            }
          }
        };

        ws.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            // console.log("[Lyria] Received audio chunk, bytes:", event.data.byteLength);

            // Guard against misaligned bytes
            if (event.data.byteLength % 2 !== 0) {
              console.warn(
                "[Lyria] Received odd byte length, trimming last byte"
              );
              const newBuffer = event.data.slice(0, event.data.byteLength - 1);
              const int16Data = new Int16Array(newBuffer);
              node.port.postMessage(int16Data);
            } else {
              const int16Data = new Int16Array(event.data);
              node.port.postMessage(int16Data);
            }
          } else {
            console.log("[Lyria] Received non-binary message:", event.data);
          }
        };

        ws.onerror = (e) => {
          console.error("[Lyria] WebSocket Error:", e);
          if (isMounted) setError("WebSocket connection failed");
        };

        ws.onclose = (ev) => {
          if (isMounted) setIsConnected(false);
          console.log("[Lyria] Disconnected", ev.code, ev.reason);
        };

        wsRef.current = ws;
      } catch (err: any) {
        console.error("[Lyria] Init failed:", err);
        if (isMounted) setError(err.message);
      }
    };

    // Initialize on mount
    initAudio();

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const updateMood = (prompt: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "STEER", prompt }));
    } else {
      console.warn(
        "[Lyria] WebSocket not ready. Queuing steering music:",
        prompt
      );
      moodQueue.current.push(prompt);
    }
  };

  // Helper to resume audio context if suspended (browser policy)
  const resumeAudio = async () => {
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      console.log("[Lyria] Resuming AudioContext...");
      await audioContextRef.current.resume();
      console.log("[Lyria] AudioContext state:", audioContextRef.current.state);
    }
  };

  return { updateMood, isConnected, error, resumeAudio };
};
