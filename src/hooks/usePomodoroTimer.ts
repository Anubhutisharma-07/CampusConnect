import { useState, useEffect, useCallback, useRef } from "react";

export type TimerPhase = "work" | "shortBreak" | "longBreak" | "idle";

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export interface PomodoroState {
  phase: TimerPhase;
  timeRemaining: number; // seconds
  totalTime: number; // seconds for current phase
  currentSession: number;
  totalSessions: number;
  isRunning: boolean;
  isPaused: boolean;
  completedSessions: number;
}

export interface UsePomodoroTimerReturn {
  state: PomodoroState;
  settings: PomodoroSettings;
  progress: number; // 0–1
  formattedTime: string; // MM:SS
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  updateSettings: (patch: Partial<PomodoroSettings>) => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: true,
  autoStartWork: false,
};

function toSeconds(minutes: number): number {
  return minutes * 60;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function usePomodoroTimer(
  initialSettings?: Partial<PomodoroSettings>,
): UsePomodoroTimerReturn {
  const [settings, setSettings] = useState<PomodoroSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });

  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [timeRemaining, setTimeRemaining] = useState(
    toSeconds(settings.workMinutes),
  );
  const [totalTime, setTotalTime] = useState(
    toSeconds(settings.workMinutes),
  );
  const [currentSession, setCurrentSession] = useState(1);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPhase = useCallback(
    (nextPhase: TimerPhase, sessionNum: number) => {
      clearTimer();

      let seconds: number;
      switch (nextPhase) {
        case "work":
          seconds = toSeconds(settings.workMinutes);
          break;
        case "shortBreak":
          seconds = toSeconds(settings.shortBreakMinutes);
          break;
        case "longBreak":
          seconds = toSeconds(settings.longBreakMinutes);
          break;
        default:
          seconds = toSeconds(settings.workMinutes);
      }

      setPhase(nextPhase);
      setTimeRemaining(seconds);
      setTotalTime(seconds);
      setCurrentSession(sessionNum);
      setIsRunning(nextPhase !== "idle");
      setIsPaused(false);
    },
    [settings, clearTimer],
  );

  // Tick
  useEffect(() => {
    if (!isRunning || isPaused) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Phase complete
          clearTimer();

          // Use setTimeout(0) to avoid state update inside interval
          setTimeout(() => {
            if (phase === "work") {
              const newCompleted = completedSessions + 1;
              setCompletedSessions(newCompleted);

              if (newCompleted % settings.sessionsBeforeLongBreak === 0) {
                startPhase("longBreak", currentSession);
              } else {
                startPhase("shortBreak", currentSession + 1);
              }
            } else if (phase === "shortBreak" || phase === "longBreak") {
              if (settings.autoStartWork) {
                startPhase("work", currentSession + 1);
              } else {
                setPhase("idle");
                setIsRunning(false);
              }
            }
          }, 0);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [
    isRunning,
    isPaused,
    phase,
    completedSessions,
    currentSession,
    settings,
    startPhase,
    clearTimer,
  ]);

  const start = useCallback(() => {
    startPhase("work", currentSession);
  }, [startPhase, currentSession]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setPhase("idle");
    setTimeRemaining(toSeconds(settings.workMinutes));
    setTotalTime(toSeconds(settings.workMinutes));
    setCurrentSession(1);
    setCompletedSessions(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [settings.workMinutes, clearTimer]);

  const skip = useCallback(() => {
    clearTimer();
    if (phase === "work") {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      if (newCompleted % settings.sessionsBeforeLongBreak === 0) {
        startPhase("longBreak", currentSession);
      } else {
        startPhase("shortBreak", currentSession + 1);
      }
    } else {
      startPhase("work", currentSession + 1);
    }
  }, [
    phase,
    completedSessions,
    currentSession,
    settings.sessionsBeforeLongBreak,
    startPhase,
    clearTimer,
  ]);

  const updateSettings = useCallback(
    (patch: Partial<PomodoroSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  return {
    state: {
      phase,
      timeRemaining,
      totalTime,
      currentSession,
      totalSessions: settings.sessionsBeforeLongBreak,
      isRunning,
      isPaused,
      completedSessions,
    },
    settings,
    progress: totalTime > 0 ? 1 - timeRemaining / totalTime : 0,
    formattedTime: formatTime(timeRemaining),
    start,
    pause,
    resume,
    reset,
    skip,
    updateSettings,
  };
}
