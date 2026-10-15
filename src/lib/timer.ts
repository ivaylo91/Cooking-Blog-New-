/**
 * Kitchen timer utility for detecting cooking times in recipe steps and
 * triggering synthesized audio & vibration alerts when countdown finishes.
 */

export interface DetectedTimer {
  seconds: number;
  label: string;
}

/**
 * Searches Bulgarian step text for standard time indications.
 * Examples:
 * - "Печете 45 минути" -> 2700s ("45 мин")
 * - "Задушете 6-8 мин" -> 480s ("8 мин")
 * - "Печете 1 час" -> 3600s ("1 ч")
 * - "Варете 1 час и 30 минути" -> 5400s ("1 ч 30 мин")
 */
export function extractStepDuration(text: string): DetectedTimer | null {
  if (!text) return null;

  // 1) Hours + minutes: e.g. "1 час и 30 мин", "2 часа и 15 минути"
  const hrMinMatch = text.match(/(\d+)\s*(?:час[ае]?|ч\.?)\s*(?:и\s*)?(\d+)\s*(?:минут[иа]|мин\.?)/i);
  if (hrMinMatch) {
    const hours = parseInt(hrMinMatch[1], 10);
    const mins = parseInt(hrMinMatch[2], 10);
    const totalSecs = (hours * 60 + mins) * 60;
    return {
      seconds: totalSecs,
      label: `${hours} ч ${mins} мин`,
    };
  }

  // 2) Hours only: e.g. "1 час", "2 часа"
  const hrMatch = text.match(/(\d+)\s*(?:час[ае]?|ч\.)/i);
  if (hrMatch) {
    const hours = parseInt(hrMatch[1], 10);
    if (hours > 0 && hours <= 12) {
      return {
        seconds: hours * 3600,
        label: `${hours} ${hours === 1 ? "час" : "часа"}`,
      };
    }
  }

  // 3) Range or single minutes: e.g. "40-45 минути", "15-20 мин", "10 минути"
  const minMatch = text.match(/(?:(\d+)\s*[-–]\s*)?(\d+)\s*(?:минут[иа]|мин\.?|мин)(?!\w)/i);
  if (minMatch) {
    // If range (e.g. 40-45), pick the upper bound for the timer default
    const mins = parseInt(minMatch[2], 10);
    if (mins > 0 && mins <= 360) {
      return {
        seconds: mins * 60,
        label: `${mins} мин`,
      };
    }
  }

  // 4) Seconds: e.g. "30 секунди", "45 сек"
  const secMatch = text.match(/(\d+)\s*(?:секунд[иа]|сек\.?|сек)(?!\w)/i);
  if (secMatch) {
    const secs = parseInt(secMatch[1], 10);
    if (secs > 0 && secs < 300) {
      return {
        seconds: secs,
        label: `${secs} сек`,
      };
    }
  }

  return null;
}

export function formatTimeRemaining(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h}:${String(remM).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Plays a pleasant three-tone chime using Web Audio API and vibrates phone.
 * Doesn't require any network request or external audio asset.
 */
export function notifyTimerFinished(): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([300, 150, 300, 150, 450]);
    }
  } catch {
    // Ignore vibration failure
  }

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (warm arpeggio)
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.16);

      gain.gain.setValueAtTime(0, now + idx * 0.16);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.16 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.16);
      osc.stop(now + idx * 0.16 + 0.6);
    });
  } catch {
    // Audio context may be restricted by autoplay policies before user gesture
  }
}

