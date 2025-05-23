import './index.css';

import Big from 'big.js';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { PulseLoader } from 'react-spinners';

import NEARLogo from '@/assets/icons/near.svg?react';
// import ApprovedImg from '@/assets/images/approved.png';
import Bg1 from '@/assets/images/home-star-bg1.png';
import Bg2 from '@/assets/images/home-star-bg2.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import useHomePage from './hooks';

const PROGRESS = [41, 66.67];

function formatNearNumber(nearNum: Big.Big) {
  if (!nearNum) return '0';
  if (nearNum.eq(0)) return '0';
  const bigNum = Big(nearNum).div(Big(10).pow(24));
  const numStr = bigNum.toFixed();
  const len = numStr.replace(/\D/g, '').length;

  if (len > 12) {
    return bigNum.div(Big('1e12')).toFixed(2) + 'T'; // Trillions
  }
  if (len > 9) {
    return bigNum.div(Big('1e9')).toFixed(2) + 'B'; // Billions
  }
  if (len > 6) {
    return bigNum.div(Big('1e6')).toFixed(2) + 'M'; // Millions
  }
  if (len > 3) {
    return bigNum.div(Big('1e3')).toFixed(2) + 'K'; // Thousands
  }
  return bigNum.toString();
}

export default function Home() {
  const { ready, votes, votedPercent, votedStakeAmount, deadlineFromNow } = useHomePage();

  const passed = useMemo(() => {
    return Number(votedPercent) >= PROGRESS[PROGRESS.length - 1];
  }, [votedPercent]);

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

        {/* approved */}
        {/* <div className="flex flex-col items-center mb-10">
          <img src={ApprovedImg} className="h-[72px]" alt="" />
        </div> */}

        <div className="flex items-center text-app-brown text-lg mb-5">
          {Object.keys(votes).length} votes & {formatNearNumber(votedStakeAmount)} NEAR
          <NEARLogo height={18} width={90} />
          Voting Power for YAE
        </div>

        <div className="flex items-center mb-22">
          <Button size="lg" className="bg-app-green h-14 text-lg text-app-black w-[184px]">
            Votes details
            <ArrowRight height={60} />
          </Button>
        </div>
      </>
    );
  };

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
