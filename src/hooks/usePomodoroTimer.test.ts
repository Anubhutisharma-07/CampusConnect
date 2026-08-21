// @vitest-environment jsdom

import { renderHook, act, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import {
  usePomodoroTimer,
  type PomodoroSettings,
} from "../hooks/usePomodoroTimer";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("usePomodoroTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it("initialises with default settings", () => {
    const { result } = renderHook(() => usePomodoroTimer());

    expect(result.current.state.phase).toBe("idle");
    expect(result.current.state.timeRemaining).toBe(25 * 60);
    expect(result.current.state.totalTime).toBe(25 * 60);
    expect(result.current.state.currentSession).toBe(1);
    expect(result.current.state.isRunning).toBe(false);
    expect(result.current.formattedTime).toBe("25:00");
    expect(result.current.progress).toBe(0);
  });

  it("accepts custom settings", () => {
    const settings: Partial<PomodoroSettings> = {
      workMinutes: 15,
      shortBreakMinutes: 3,
      longBreakMinutes: 10,
    };

    const { result } = renderHook(() => usePomodoroTimer(settings));

    expect(result.current.state.timeRemaining).toBe(15 * 60);
    expect(result.current.settings.workMinutes).toBe(15);
    expect(result.current.settings.shortBreakMinutes).toBe(3);
    expect(result.current.settings.longBreakMinutes).toBe(10);
  });

  it("starts a work phase", () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.state.phase).toBe("work");
    expect(result.current.state.isRunning).toBe(true);
    expect(result.current.state.isPaused).toBe(false);
  });

  it("pauses and resumes", () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.pause();
    });
    expect(result.current.state.isPaused).toBe(true);

    act(() => {
      result.current.resume();
    });
    expect(result.current.state.isPaused).false;
  });

  it("ticks down each second", () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.state.timeRemaining).toBe(25 * 60 - 3);
    expect(result.current.formattedTime).toBe("24:57");
  });

  it("updates progress as time elapses", () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ workMinutes: 10 }),
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(result.current.progress).toBeCloseTo(0.5, 1);
  });

  it("resets to initial state", () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state.phase).toBe("idle");
    expect(result.current.state.timeRemaining).toBe(25 * 60);
    expect(result.current.state.isRunning).toBe(false);
    expect(result.current.state.completedSessions).toBe(0);
    expect(result.current.formattedTime).toBe("25:00");
  });

  it("skips to short break from work phase", () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.skip();
    });

    expect(result.current.state.phase).toBe("shortBreak");
    expect(result.current.state.timeRemaining).toBe(5 * 60);
  });

  it("updates settings dynamically", () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.updateSettings({ workMinutes: 45 });
    });

    expect(result.current.settings.workMinutes).toBe(45);
  });

  it("formats time correctly for edge cases", () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ workMinutes: 1 }),
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.formattedTime).toBe("01:00");

    act(() => {
      vi.advanceTimersByTime(61000);
    });
  });
});
