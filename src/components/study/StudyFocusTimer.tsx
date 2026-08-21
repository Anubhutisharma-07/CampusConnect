import { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Timer,
  Coffee,
  Moon,
  Zap,
  X,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePomodoroTimer, type TimerPhase } from "../../hooks/usePomodoroTimer";

const PHASE_CONFIG: Record<
  TimerPhase,
  { label: string; icon: typeof Play; color: string; bgClass: string; ringClass: string }
> = {
  work: {
    label: "Focus Time",
    icon: Zap,
    color: "#f59e0b",
    bgClass: "bg-amber-500/10 border-amber-500/30",
    ringClass: "text-amber-500",
  },
  shortBreak: {
    label: "Short Break",
    icon: Coffee,
    color: "#22d3ee",
    bgClass: "bg-cyan-500/10 border-cyan-500/30",
    ringClass: "text-cyan-500",
  },
  longBreak: {
    label: "Long Break",
    icon: Moon,
    color: "#a78bfa",
    bgClass: "bg-violet-500/10 border-violet-500/30",
    ringClass: "text-violet-500",
  },
  idle: {
    label: "Ready to Focus",
    icon: Timer,
    color: "#94a3b8",
    bgClass: "bg-slate-500/10 border-slate-500/30",
    ringClass: "text-slate-400",
  },
};

interface SettingsPanelProps {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  onSave: (patch: Record<string, unknown>) => void;
  onClose: () => void;
}

function SettingsPanel({
  workMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  sessionsBeforeLongBreak,
  autoStartBreaks,
  autoStartWork,
  onSave,
  onClose,
}: SettingsPanelProps) {
  const [localWork, setLocalWork] = useState(workMinutes);
  const [localShort, setLocalShort] = useState(shortBreakMinutes);
  const [localLong, setLocalLong] = useState(longBreakMinutes);
  const [localSessions, setLocalSessions] = useState(sessionsBeforeLongBreak);
  const [localAutoBreaks, setLocalAutoBreaks] = useState(autoStartBreaks);
  const [localAutoWork, setLocalAutoWork] = useState(autoStartWork);

  return (
    <div className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 p-5 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Timer Settings
        </h4>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close settings"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-amber-400 uppercase">
            Focus
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={localWork}
            onChange={(e) => setLocalWork(Number(e.target.value))}
            className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-200 text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <span className="text-[9px] text-slate-500 text-center">min</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-cyan-400 uppercase">
            Short
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={localShort}
            onChange={(e) => setLocalShort(Number(e.target.value))}
            className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-200 text-center focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <span className="text-[9px] text-slate-500 text-center">min</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-violet-400 uppercase">
            Long
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={localLong}
            onChange={(e) => setLocalLong(Number(e.target.value))}
            className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-200 text-center focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <span className="text-[9px] text-slate-500 text-center">min</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-slate-400 uppercase">
          Sessions before long break
        </label>
        <input
          type="number"
          min={2}
          max={10}
          value={localSessions}
          onChange={(e) => setLocalSessions(Number(e.target.value))}
          className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-200 text-center focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={localAutoBreaks}
            onChange={(e) => setLocalAutoBreaks(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-8 h-4 rounded-full relative transition-colors ${
              localAutoBreaks ? "bg-cyan-500" : "bg-slate-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                localAutoBreaks ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            Auto-start breaks
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={localAutoWork}
            onChange={(e) => setLocalAutoWork(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-8 h-4 rounded-full relative transition-colors ${
              localAutoWork ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                localAutoWork ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            Auto-start focus
          </span>
        </label>
      </div>

      <button
        onClick={() =>
          onSave({
            workMinutes: localWork,
            shortBreakMinutes: localShort,
            longBreakMinutes: localLong,
            sessionsBeforeLongBreak: localSessions,
            autoStartBreaks: localAutoBreaks,
            autoStartWork: localAutoWork,
          })
        }
        className="mt-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl py-2.5 transition-colors"
      >
        <Check size={14} /> Save Settings
      </button>
    </div>
  );
}

export interface StudyFocusTimerProps {
  onSessionComplete?: (sessionNumber: number, totalMinutes: number) => void;
  soundEnabled?: boolean;
}

export default function StudyFocusTimer({
  onSessionComplete,
  soundEnabled = true,
}: StudyFocusTimerProps) {
  const {
    state,
    settings,
    progress,
    formattedTime,
    start,
    pause,
    resume,
    reset,
    skip,
    updateSettings,
  } = usePomodoroTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [sessionLog, setSessionLog] = useState<
    { session: number; duration: number; completedAt: Date }[]
  >([]);

  const phaseConfig = PHASE_CONFIG[state.phase];
  const PhaseIcon = phaseConfig.icon;

  // SVG circle params
  const size = 180;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleStart = () => {
    if (state.isPaused) {
      resume();
    } else if (!state.isRunning) {
      start();
    }
  };

  const handleSessionComplete = () => {
    if (state.phase === "work") {
      setSessionLog((prev) => [
        ...prev,
        {
          session: state.currentSession,
          duration: settings.workMinutes,
          completedAt: new Date(),
        },
      ]);
      onSessionComplete?.(state.currentSession, settings.workMinutes);
    }
  };

  return (
    <div
      className={`relative bg-slate-900/80 backdrop-blur-sm border rounded-2xl p-6 shadow-xl max-w-sm w-full mx-auto overflow-hidden transition-colors duration-500 ${phaseConfig.bgClass}`}
    >
      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          workMinutes={settings.workMinutes}
          shortBreakMinutes={settings.shortBreakMinutes}
          longBreakMinutes={settings.longBreakMinutes}
          sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
          autoStartBreaks={settings.autoStartBreaks}
          autoStartWork={settings.autoStartWork}
          onSave={(patch) => {
            updateSettings(patch as Record<string, unknown>);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <PhaseIcon size={16} className={phaseConfig.ringClass} />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            {phaseConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Timer settings"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Circular Timer */}
      <div className="flex justify-center mb-5">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-700/50"
            />
            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={phaseConfig.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 6px ${phaseConfig.color}40)` }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-mono font-bold text-slate-100 tabular-nums tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-1">
              Session {state.currentSession} of {state.totalSessions}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={reset}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700 hover:border-slate-600"
          aria-label="Reset timer"
        >
          <RotateCcw size={16} />
        </button>

        {!state.isRunning || state.isPaused ? (
          <button
            onClick={handleStart}
            className="p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
            aria-label={state.isPaused ? "Resume timer" : "Start timer"}
          >
            <Play size={20} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={pause}
            className="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all border border-slate-600"
            aria-label="Pause timer"
          >
            <Pause size={20} />
          </button>
        )}

        <button
          onClick={skip}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700 hover:border-slate-600"
          aria-label="Skip phase"
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* Session Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-3">
        {Array.from({ length: state.totalSessions }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < state.completedSessions
                ? "bg-amber-500 shadow-sm shadow-amber-500/50"
                : i === state.currentSession - 1 && state.phase === "work"
                  ? "bg-amber-500/30 ring-1 ring-amber-500/50"
                  : "bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Today's Sessions Log */}
      {sessionLog.length > 0 && (
        <div className="border-t border-slate-700/50 pt-3 mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Today&apos;s Focus
            </span>
            <span className="text-[10px] font-mono text-amber-400">
              {sessionLog.reduce((sum, s) => sum + s.duration, 0)} min
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sessionLog.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-0.5"
              >
                <Zap size={8} className="text-amber-500" />
                <span className="text-[9px] font-mono text-amber-300">
                  #{entry.session}
                </span>
                <span className="text-[9px] text-slate-500">
                  {entry.duration}m
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
