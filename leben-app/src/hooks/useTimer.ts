import { useState, useEffect, useRef } from 'react';

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) return;
    expiredRef.current = false;
    ref.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(ref.current!);
          setRunning(false);
          expiredRef.current = true;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current!);
  }, [running]);

  useEffect(() => {
    if (expiredRef.current) {
      expiredRef.current = false;
      onExpireRef.current?.();
    }
  }, [seconds]);

  const start = () => setRunning(true);
  const stop = () => { setRunning(false); clearInterval(ref.current!); };
  const reset = () => { stop(); setSeconds(initialSeconds); };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return { seconds, formatted: `${mm}:${ss}`, start, stop, reset, running };
}
