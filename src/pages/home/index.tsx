import './index.css';

import { useMemo } from 'react';

import Bg1 from '@/assets/images/home-star-bg1.png';
import Bg2 from '@/assets/images/home-star-bg2.png';
import { cn } from '@/lib/utils';

import useHomePage from './hooks';

const PROGRESS = [41, 66.67];

export default function Home() {
  const { votedPercent, deadlineFromNow } = useHomePage();

  const passed = useMemo(() => {
    return Number(votedPercent) >= PROGRESS[PROGRESS.length - 1];
  }, [votedPercent]);

  return (
    <div className="flex flex-col relative w-full min-h-screen pb-10 px-6 md:px-0">
      <img src={Bg1} alt="" className="absolute left-0 top-0 hidden md:flex" width={280} />
      <img src={Bg2} alt="" className="absolute right-0 top-0 hidden md:flex" width={280} />
      <div className="md:w-[654px] w-full mx-auto flex flex-col items-center bg-white z-[2] flex-1">
        <h1 className="text-[28px] sm:text-[40px] font-semibold py-8 sm:py-10 mb-10 text-app-black">
          Reduce NEAR's Inflation
        </h1>

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
        {deadlineFromNow && (
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-app-black-400 text-lg font-semibold mb-4">Voting Progress</h3>
            <div className="flex items-center gap-x-9">
              <div className="flex flex-col items-center">
                <div className="text-app-black text-[56px] font-bold">{deadlineFromNow.days}</div>
                <div className="text-app-black-600 text-xl">Days</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-app-black text-[56px] font-bold">{deadlineFromNow.hours}</div>
                <div className="text-app-black-600 text-xl">HRS</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-app-black text-[56px] font-bold">
                  {deadlineFromNow.minutes}
                </div>
                <div className="text-app-black-600 text-xl">MINS</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-app-black text-[56px] font-bold">
                  {deadlineFromNow.seconds}
                </div>
                <div className="text-app-black-600 text-xl">SECS</div>
              </div>
            </div>
          </div>
        )}

        {/* content */}
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
