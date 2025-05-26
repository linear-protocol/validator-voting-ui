import './index.css';

import dayjs from 'dayjs';
import { ArrowRight, CircleHelp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { useInterval } from 'react-use';

import NEARLogo from '@/assets/icons/near.svg?react';
import ApprovedImg from '@/assets/images/approved.png';
import Bg1 from '@/assets/images/home-star-bg1.png';
import Bg2 from '@/assets/images/home-star-bg2.png';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import VoteContainer from '@/containers/vote';
import { cn, formatBigNumber } from '@/lib/utils';

const PROGRESS = [41, 66.67];

export default function Home() {
  const navigate = useNavigate();
  const { ready, deadline, votes, votedPercent, voteFinishedAt, votedStakeAmount } =
    VoteContainer.useContainer();

  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

  const passed = useMemo(() => {
    return Number(votedPercent) >= PROGRESS[PROGRESS.length - 1];
  }, [votedPercent]);

  const showTooltip = useMemo(() => {
    if (voteFinishedAt) return false;
    return passed;
  }, [voteFinishedAt, passed]);

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

  const renderVoteProgressStatus = () => {
    if (!voteFinishedAt) {
      if (!deadlineFromNow) return null;
      return (
        <div className="flex flex-col items-center mb-10">
          <h3 className="text-app-black-400 text-base sm:text-lg mb-4">VOTING PROGRESS</h3>
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

    return (
      <div className="flex flex-col items-center mb-10">
        <img src={ApprovedImg} className="h-[72px]" alt="" />
      </div>
    );
  };

  const renderContent = () => {
    if (!ready) {
      return (
        <div className="flex flex-col w-full items-center justify-center h-80">
          <PulseLoader />
        </div>
      );
    }

    return (
      <>
        {/* progress bar */}
        <div className="flex flex-col w-full relative mb-10">
          <div
            className={cn(
              'absolute flex items-center justify-center text-white w-[68px] h-[32px] -top-11 font-semibold bg-app-black rounded-full -translate-x-1/2',
              { passed: passed },
            )}
            style={{
              left: `${PROGRESS[PROGRESS.length - 1]}%`,
            }}
          >
            Pass
            <svg
              width="13"
              height="6"
              viewBox="0 0 13 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-1/2 -translate-x-1/2 -bottom-[5px]"
            >
              <path
                d="M7.91421 4.58579C7.13316 5.36683 5.86683 5.36684 5.08579 4.58579L0.5 0L12.5 6.05683e-07L7.91421 4.58579Z"
                fill={passed ? '#82E55D' : '#1E1E1E'}
              />
            </svg>
          </div>

          <div className="flex items-center w-full h-6 bg-[hsla(0,0%,12%,0.08)] rounded-full relative">
            {PROGRESS.map((p) => (
              <div
                key={p}
                className="flex h-full w-0.5 bg-[hsla(0,0%,12%,0.08)] absolute"
                style={{ left: `${p}%` }}
              ></div>
            ))}
            <div
              className="h-full bg-[hsla(158,100%,43%,1)] rounded-full"
              style={{ width: `${votedPercent}%` }}
            ></div>
          </div>
          <div className="flex items-center h-10 text-base justify-between relative">
            <div>0%</div>
            {PROGRESS.map((p) => (
              <div key={p} className="absolute -translate-x-1/2" style={{ left: `${p}%` }}>
                {p}%
              </div>
            ))}
            <div>100%</div>
          </div>
        </div>

        {/* voting process status */}
        {renderVoteProgressStatus()}

        <div className="flex items-center justify-center text-app-brown text-base sm:text-lg mb-5 gap-1 flex-wrap">
          {Object.keys(votes).length} votes & {formatBigNumber(votedStakeAmount)} NEAR
          <NEARLogo className="sm:h-4 sm:w-20 h-3 w-16" />
          <div className="flex items-center">
            Voting Power for YAE
            {!showTooltip && (
              <Popover>
                <PopoverTrigger>
                  <CircleHelp className="ml-1 sm:ml-2 -mt-0.5 w-5 h-5 sm:w-6 sm:h-6" />
                </PopoverTrigger>
                <PopoverContent sideOffset={20}>
                  The proposal will pass if the total voted stake keeps above 2/3 at the beginning
                  of next epoch or a new vote comes in.
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="flex items-center mb-22">
          <Button
            size="lg"
            className="bg-app-green hover:bg-app-green cursor-pointer hover:opacity-75 h-14 text-lg text-app-black w-[184px]"
            onClick={(ev) => {
              ev.stopPropagation();
              navigate('/details');
            }}
          >
            Votes details
            <ArrowRight height={60} />
          </Button>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (!deadline) return;
    const now = dayjs();
    const then = dayjs(deadline);
    const diff = now.isBefore(then) ? then.diff(now) : now.diff(then);
    const diffSeconds = Math.floor(diff / 1000);
    setCountdownSeconds(diffSeconds);
  }, [deadline]);

  useInterval(
    () => {
      if (!deadline) return;
      setCountdownSeconds((s) => (s ? s - 1 : s));
    },
    deadline ? 1000 : null,
  );

  return (
    <div className="flex flex-col relative w-full min-h-screen pb-10 px-6 md:px-0">
      <img src={Bg1} alt="" className="absolute left-0 top-0 hidden md:flex" width={280} />
      <img src={Bg2} alt="" className="absolute right-0 top-0 hidden md:flex" width={280} />
      <div className="md:w-[654px] w-full mx-auto flex flex-col items-center bg-white z-[2] flex-1">
        <h1 className="text-[28px] sm:text-[40px] font-semibold py-8 sm:py-10 mb-10 text-app-black">
          Reduce NEAR's Inflation
        </h1>

        {renderContent()}

        {/* article */}
        <div className="flex flex-col">
          <h3 className="text-xl text-app-black font-semibold mb-3">Reduce near's inflation</h3>
          <p className="mb-3">
            PEPE is a widely held, highly liquid asset in the crypto ecosystem. Its rapid growth in
            adoption, substantial trading volumes, and deep liquidity across major centralized and
            decentralized exchanges make it a natural candidate for integration into AAVE.
          </p>
          <img src="/example.png" alt="" className="rounded shadow mb-4" />
          <h3 className="text-xl text-app-black font-semibold mb-3">Reduce near's inflation</h3>
          <p className="mb-3">
            PEPE is a widely held, highly liquid asset in the crypto ecosystem. Its rapid growth in
            adoption, substantial trading volumes, and deep liquidity across major centralized and
            decentralized exchanges make it a natural candidate for integration into AAVE.PEPE is a
            widely held, highly liquid asset in the crypto ecosystem. Its rapid growth in adoption,
            substantial trading volumes, and deep liquidity across major centralized and
            decentralized exchanges make it a natural candidate for integration into AAVE.
          </p>
        </div>
      </div>
    </div>
  );
}
