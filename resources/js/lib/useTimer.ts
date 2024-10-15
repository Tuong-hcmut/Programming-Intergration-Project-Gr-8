import { useCallback, useEffect, useState } from 'react';

interface TimerState {
    minutes: number;
    seconds: number;
    isRunning: boolean;
}

interface TimerControls {
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
}

export function useTimer(): TimerState & TimerControls {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isRunning]);

    const startTimer = useCallback(() => setIsRunning(true), []);
    const stopTimer = useCallback(() => setIsRunning(false), []);
    const resetTimer = useCallback(() => {
        stopTimer();
        setTime(0);
    }, [stopTimer]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return {
        minutes,
        seconds,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer,
    };
}
