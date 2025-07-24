import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { useInterval } from 'react-use';
import ApprovedImg from '@/assets/images/approved.png';

export interface CountdownProps {
  votedPercent: string;
  deadline: number | null;
}

export default function Countdown({ deadline }: CountdownProps) {
  const [isPageVisible, setPageVisibility] = useState(!document.hidden);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  const finished = deadline && Date.now() > deadline;

  const deadlineFromNow = useMemo(() => {
    if (!countdownSeconds) return null;
    const diffSeconds = countdownSeconds;
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const seconds = diffSeconds % 60;
    const minutes = diffMinutes % 60;
    const hours = diffHours % 24;
    const days = diffDays;
    return {
      seconds: seconds.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      days: days.toString().padStart(2, '0'),
    };
  }, [countdownSeconds]);

  useEffect(() => {
    if (!deadline) return;
    const now = dayjs();
    const then = dayjs(deadline);
    const diff = now.isBefore(then) ? then.diff(now) : now.diff(then);
    const diffSeconds = Math.floor(diff / 1000);
    setCountdownSeconds(diffSeconds);
  }, [deadline, isPageVisible]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPageVisibility(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useInterval(
    () => {
      if (!deadline) return;
      setCountdownSeconds((s) => (s ? s - 1 : s));
    },
    deadline ? 1000 : null,
  );

  if (!deadlineFromNow) return null;

  if (finished) {
    return (
      <div className="flex flex-col items-center mb-10">
        {/* <h3 className="text-app-black-400 text-base sm:text-lg mb-4">
          {votedPercent}% of Stake Voted for YEA
        </h3> */}
        <img src={ApprovedImg} className="h-[72px]" alt="" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-10">
      {/* <h3 className="text-app-black-400 text-base sm:text-lg mb-4">
        {votedPercent}% of Stake Voted for YEA
      </h3> */}
      <div className="flex items-center gap-x-5 sm:gap-x-9">
        <div className="flex flex-col items-center">
          <div className="text-app-black text-4xl sm:text-[56px] font-bold">
            {deadlineFromNow.days}
          </div>
          <div className="text-app-black-600 text-base sm:text-xl">Days</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-app-black text-4xl sm:text-[56px] font-bold">
            {deadlineFromNow.hours}
          </div>
          <div className="text-app-black-600 text-base sm:text-xl">HRS</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-app-black text-4xl sm:text-[56px] font-bold">
            {deadlineFromNow.minutes}
          </div>
          <div className="text-app-black-600 text-base sm:text-xl">MINS</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-app-black text-4xl sm:text-[56px] font-bold">
            {deadlineFromNow.seconds}
          </div>
          <div className="text-app-black-600 text-base sm:text-xl">SECS</div>
        </div>
      </div>
    </div>
  );
}
