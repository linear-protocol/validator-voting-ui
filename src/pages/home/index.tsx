import './index.css';

import { ArrowRight, CircleHelp } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import NEARLogo from '@/assets/icons/near.svg?react';
import ApprovedImg from '@/assets/images/approved.png';
import Bg1 from '@/assets/images/home-star-bg1.png';
import Bg2 from '@/assets/images/home-star-bg2.png';
import Markdown from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import config from '@/config';
import VoteContainer from '@/containers/vote';
import { cn, formatBigNumber } from '@/lib/utils';

import Countdown from './components/Countdown';

function toFraction(x: number): string {
  if (!x) return '2/3';
  if (x > 1) x = x / 100;
  try {
    const tolerance = 0.01;
    let h1 = 1,
      h2 = 0,
      k1 = 0,
      k2 = 1,
      b = x;
    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(x - h1 / k1) > x * tolerance);

    return h1 + '/' + k1;
  } catch (error) {
    console.error('Error converting to fraction:', error);
    return '2/3';
  }
}

export default function Home() {
  const navigate = useNavigate();
  const {
    isLoading,
    deadline,
    votes,
    votedPercent,
    progressList,
    voteFinishedAt,
    votedStakeAmount,
  } = VoteContainer.useContainer();

  const passed = useMemo(() => {
    return Number(votedPercent) >= progressList[progressList.length - 1];
  }, [votedPercent, progressList]);

  const showTooltip = useMemo(() => {
    if (voteFinishedAt) return false;
    return passed;
  }, [voteFinishedAt, passed]);

  const renderVoteProgressStatus = () => {
    if (!voteFinishedAt) {
      return <Countdown deadline={deadline} />;
    }

    return (
      <div className="flex flex-col items-center mb-10">
        <img src={ApprovedImg} className="h-[72px]" alt="" />
      </div>
    );
  };

  const renderProgress = () => {
    const _percent = Number(votedPercent);
    return (
      <div className="relative w-full">
        <div className="flex items-center w-full h-6 bg-[hsla(0,0%,12%,0.08)] rounded-full overflow-hidden">
          {progressList.map((p) => (
            <div
              key={p}
              className="flex h-full w-0.5 -translate-x-1/2 bg-[hsla(0,0%,12%,0.08)] absolute"
              style={{ left: `${p}%` }}
            ></div>
          ))}
          <div
            className="h-full bg-[hsla(158,100%,43%,1)] rounded-full rounded-r-none flex items-center"
            style={{ width: `${votedPercent}%` }}
          >
            {!!votedPercent && (
              <div
                key={votedPercent}
                className={cn('text-sm flex items-center h-full', {
                  'justify-end pr-1.5 text-white w-full': _percent > 7,
                  'text-app-black pl-1.5': _percent <= 7,
                })}
              >
                {votedPercent}%
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
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
              left: `${progressList[progressList.length - 1]}%`,
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

          {renderProgress()}
          <div className="flex items-center h-10 text-base justify-between relative">
            <div>0%</div>
            {progressList.map((p) => (
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
          {Object.keys(votes).length} Votes & {formatBigNumber(votedStakeAmount)}
          <NEARLogo className="sm:h-4 sm:w-18 h-3 w-16" />
          <div className="flex items-center">
            Voting Power for YAE
            {showTooltip && (
              <Popover>
                <PopoverTrigger>
                  <CircleHelp className="ml-1 sm:ml-2 -mt-0.5 w-5 h-5 sm:w-6 sm:h-6" />
                </PopoverTrigger>
                <PopoverContent sideOffset={20}>
                  The proposal will pass if the total voted stake keeps above{' '}
                  {toFraction(Number(votedPercent))} at the beginning of next epoch or a new vote
                  comes in.
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

  return (
    <div className="flex flex-col relative w-full min-h-screen pb-20 px-6 md:px-0">
      <img src={Bg1} alt="" className="absolute left-0 top-0 hidden md:flex" width={280} />
      <img src={Bg2} alt="" className="absolute right-0 top-0 hidden md:flex" width={280} />
      <div className="md:w-[654px] w-full mx-auto flex flex-col items-center bg-white z-[2] flex-1">
        <h1 className="text-[28px] sm:text-[40px] font-semibold py-8 sm:py-10 mb-10 text-app-black">
          Reduce NEAR's Inflation
        </h1>

        {renderContent()}

        {/* article */}
        <div className="flex flex-col w-full mb-4">
          <Markdown
            content={`> NEAR's annual inflation target was set to 5% when mainnet was launched and has never been updated since then. The hope was that there would be sufficient transaction fees burnt to make the actual inflation in the range of 2-3%. However, over the past 12 months, only 1.58m NEAR are burnt in transaction fees, which is ~0.1% of the total supply. High inflation that compounds over the years leads to more than 60m NEAR a year being added to the total supply, which devalues the NEAR token gradually over time. In the past several months, multiple Proof-of-Stake blockchains have put forward proposals to reduce inflation:
>
> - <a href="https://polkadot.polkassembly.io/referenda/1271" target="_blank">Polkadot</a>
> - <a href="https://github.com/solana-foundation/solana-improvement-documents/pull/228" target="_blank">Solana</a>
> - <a href="https://github.com/aptos-foundation/AIPs/pull/586" target="_blank">Aptos</a>
>
> This proposal aims to reduce the overall inflation and change it to 2.5%.`}
          />
        </div>

        {/* command */}
        <div className="flex flex-col w-full mt-2">
          <Markdown
            content={
              'Vote with <a href="https://docs.near.org/tools/near-cli/" target="_blank">NEAR CLI</a>\n' +
              '```bash\n' +
              `near call <validator-account-id> vote '{"voting_account_id":"${config.proposalContractId}","is_vote":true}' --accountId <validator-owner-id> --gas 200000000000000\n` +
              '```'
            }
          />
        </div>
      </div>
    </div>
  );
}
