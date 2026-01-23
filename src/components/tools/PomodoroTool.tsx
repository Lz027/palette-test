import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Timer, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PomodoroToolProps {
  boardId: string;
  onClose: () => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS: Record<TimerMode, { minutes: number; label: string; icon: typeof Timer }> = {
  work: { minutes: 25, label: 'Focus Time', icon: Brain },
  shortBreak: { minutes: 5, label: 'Short Break', icon: Coffee },
  longBreak: { minutes: 15, label: 'Long Break', icon: Coffee },
};

export const PomodoroTool = ({ boardId, onClose }: PomodoroToolProps) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const resetTimer = useCallback((newMode?: TimerMode) => {
    const targetMode = newMode || mode;
    setTimeLeft(TIMER_SETTINGS[targetMode].minutes * 60);
    setIsRunning(false);
    if (newMode) setMode(newMode);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedPomodoros(prev => prev + 1);
        toast.success('Focus session complete! Take a break.');
        // Auto-switch to break
        const nextMode = (completedPomodoros + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        resetTimer(nextMode);
      } else {
        toast.success('Break over! Ready to focus?');
        resetTimer('work');
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, completedPomodoros, resetTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (TIMER_SETTINGS[mode].minutes * 60);
  const ModeIcon = TIMER_SETTINGS[mode].icon;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Timer className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-semibold">Pomodoro Timer</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Mode Tabs */}
        <div className="flex gap-2 justify-center">
          {(Object.keys(TIMER_SETTINGS) as TimerMode[]).map((timerMode) => (
            <Button
              key={timerMode}
              variant={mode === timerMode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => resetTimer(timerMode)}
              className={cn(
                "rounded-full text-xs",
                mode === timerMode && mode === 'work' && "bg-red-500 hover:bg-red-600",
                mode === timerMode && mode !== 'work' && "bg-green-500 hover:bg-green-600"
              )}
            >
              {TIMER_SETTINGS[timerMode].label}
            </Button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            {/* Background Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={mode === 'work' ? 'text-red-500' : 'text-green-500'}
                strokeDasharray={553}
                strokeDashoffset={553 * (1 - progress)}
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 * (1 - progress) }}
              />
            </svg>

            {/* Timer Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ModeIcon className={cn(
                "w-6 h-6 mb-2",
                mode === 'work' ? 'text-red-500' : 'text-green-500'
              )} />
              <span className="text-4xl font-bold font-mono">{formatTime(timeLeft)}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {TIMER_SETTINGS[mode].label}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => resetTimer()}
            className="rounded-full h-12 w-12"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "rounded-full h-14 w-14",
              mode === 'work' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            )}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{completedPomodoros}</p>
            <p className="text-xs text-muted-foreground">Pomodoros Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{completedPomodoros * 25}</p>
            <p className="text-xs text-muted-foreground">Minutes Focused</p>
          </div>
        </div>
      </div>
    </div>
  );
};