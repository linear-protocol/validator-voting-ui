import './index.css';

import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import NEARLogo from '@/assets/images/near-green.jpg';
import Bg1 from '@/assets/images/home-star-bg1.png';
import Bg2 from '@/assets/images/home-star-bg2.png';
import Markdown from '@/components/markdown';
import { Button } from '@/components/ui/button';
import config from '@/config';
import VoteContainer from '@/containers/vote';
import { cn, formatBigNumber, isNotNullAndNumber } from '@/lib/utils';
import { article } from './article';
import YesIcon from '@/assets/icons/yes.svg?react';
import NoIcon from '@/assets/icons/no.svg?react';
import ApprovedImg from '@/assets/images/approved.png';

import Countdown from './components/Countdown';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Big from 'big.js';

dayjs.extend(utc);

export default function Home() {
  const navigate = useNavigate();
  const {
    isLoading,
    deadline,
    votes,
    voteResult,
    yesVotesCount,
    votedPercent,
    votedYeaStakeAmount,
  } = VoteContainer.useContainer();

  const NEAR_ENV = config.proposalContractId?.split('.').pop() === 'near' ? 'mainnet' : 'testnet';

  const renderVoteProgressStatus = () => {
    if (voteResult) {
      return (
        <div className="flex flex-col items-center mb-10">
          {/* <h3 className="text-app-black-400 text-base sm:text-lg mb-4">
          {votedPercent}% of Stake Voted for YEA
        </h3> */}
          <img src={ApprovedImg} className="h-[72px]" alt="" />
        </div>
      );
    }
    return <Countdown deadline={deadline} votedPercent={votedPercent} />;
  };

  const renderProgress = () => {
    const votedPercentNum = Number(votedPercent);
    const targetPercent = 33.33;
    const passed = votedPercentNum >= targetPercent;

    const currentProgressPercent = passed
      ? 100
      : Math.round((votedPercentNum / targetPercent) * 100);

    const targetBadge = (
      <div
        className={cn(
          'absolute flex items-center justify-center text-white w-[68px] h-[30px] left-1/2 -top-[70px] text-sm bg-app-black rounded-full -translate-x-1/2',
        )}
      >
        Target
        <svg
          width="13"
          height="6"
          viewBox="0 0 13 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('absolute -bottom-[5px]', {
            'left-1/2 -translate-x-1/2': passed,
            'right-[20px]': !passed,
          })}
        >
          <path
            d="M7.91421 4.58579C7.13316 5.36683 5.86683 5.36684 5.08579 4.58579L0.5 0L12.5 6.05683e-07L7.91421 4.58579Z"
            fill="#1E1E1E"
          />
        </svg>
      </div>
    );

    return (
      <div className="flex flex-col w-full relative mb-6">
        <h3 className="flex uppercase justify-center mb-10 text-lg text-[rgba(30,30,30,0.4)]">
          {votedPercentNum}% of STAKE VOTED
        </h3>
        <div className="relative w-full">
          <div className="flex items-center w-full h-6 bg-[hsla(0,0%,12%,0.08)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsla(158,100%,43%,1)] rounded-full flex items-center"
              style={{ width: `${currentProgressPercent}%` }}
            >
              {!!votedPercentNum && (
                <div
                  key={votedPercentNum}
                  className={cn('text-sm flex items-center h-full', {
                    'justify-end pr-1.5 text-white w-full': currentProgressPercent > 20,
                    'text-app-black pl-1.5': currentProgressPercent <= 20,
                  })}
                >
                  {votedPercentNum}%
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center h-10 text-base justify-between relative">
          <div>0%</div>

          {passed ? (
            <>
              <div
                className="absolute -translate-x-1/2"
                style={{ left: `${Math.round((targetPercent / votedPercentNum) * 100)}%` }}
              >
                {targetPercent}%{targetBadge}
                <div className="flex w-0.5 left-1/2 h-[24px] -top-[32px] -translate-x-1/2 bg-[hsla(0,0%,12%,0.08)] absolute"></div>
              </div>
            </>
          ) : (
            <div className="absolute" style={{ right: '0' }}>
              {targetPercent}%{targetBadge}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVoteBar = () => {
    const voteData = Object.values(votes).reduce(
      (acc, [vote, stake]) => {
        if (!acc[vote]) {
          acc[vote] = Big(stake);
        } else {
          acc[vote] = acc[vote].plus(Big(stake));
        }
        return acc;
      },
      {} as Record<'yes' | 'no', Big.Big>,
    );

    const safeBig = (val: Big.Big | undefined): Big => (val instanceof Big ? val : Big(val || 0));

    const yes = safeBig(voteData?.yes);
    const no = safeBig(voteData?.no);
    const voteTotal = yes.plus(no);

    const yesPercent = voteTotal.eq(0) ? '0.00' : yes.div(voteTotal).times(100).toFixed(2);
    const noPercent = voteTotal.eq(0) ? '0.00' : no.div(voteTotal).times(100).toFixed(2);

    return (
      <div className="flex items-center w-full mb-10 gap-x-3">
        <div className="flex flex-col gap-y-1 text-sm">
          <YesIcon className="w-6.5 h-6.5" />
          YEA
        </div>
        <div className="flex relative rounded-full items-center flex-1 h-11 w-full overflow-hidden">
          <div
            className="flex absolute left-0 h-full top-0 bottom-0 bg-[rgba(61,132,255,1)]"
            style={{ width: `${yesPercent}%` }}
          >
            <div className="flex items-center absolute left-3 h-full text-white text-sm">
              {yesPercent}%
            </div>
            <div className="absolute -right-[1px] w-[2px] bg-white h-full top-0 bottom-0 z-10"></div>
          </div>
          <div
            className="flex absolute right-0 top-0 h-full bottom-0 bg-[rgba(255,63,63,1)]"
            style={{ width: `${noPercent}%` }}
          >
            <div className="flex items-center absolute right-3 h-full text-white text-sm">
              {noPercent}%
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-1 text-sm">
          <NoIcon className="w-6.5 h-6.5" />
          NAY
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
        {renderProgress()}

        {/* vote bar */}
        {renderVoteBar()}

        {/* voting process status */}
        {renderVoteProgressStatus()}

        <div className="flex items-center justify-center text-app-brown text-base sm:text-lg mb-5 gap-1 flex-wrap">
          {isNotNullAndNumber(yesVotesCount) ? yesVotesCount : '-'} Votes &{' '}
          {formatBigNumber(votedYeaStakeAmount)}
          <img src={NEARLogo} alt="near" className="flex h-5.5 -mt-0.5 rounded mx-0.5" />
          <div className="flex items-center">Voting Power for YEA</div>
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
      <div className="md:w-[700px] w-full mx-auto flex flex-col items-center bg-white z-[2] flex-1">
        <h1 className="text-[28px] sm:text-[38px] font-semibold text-center py-8 sm:py-10 mb-10 text-app-black">
          Improve NEAR Token Economy with Reduced Inflation
        </h1>
        {renderContent()}
      </div>
      <div className="md:max-w-4/5 w-full mx-auto flex flex-col items-center bg-white z-[2] flex-1">
        {/* article */}
        <div className="flex flex-col w-full">
          <Markdown content={article} />
        </div>

        {/* command */}
        <div className="flex flex-col w-full">
          <Markdown
            content={
              '## Vote with <a href="https://docs.near.org/tools/near-cli/" target="_blank">NEAR CLI</a>\n' +
              'Instructions for Validator Voting:\n' +
              '- If you are a validator, please use the CLI commands shown below to vote. We do not support voting through wallet for security considerations. This page is only used to display voting results.\n' +
              `- You can vote **yes** or **no** for the proposal. You can change your vote before the deadline (**${dayjs.utc(deadline).format('MM/DD/YYYY HH:mm:ss')} UTC**).\n` +
              '- This proposal will be approved if more than **1/3 of total stake** joins the voting and more than **2/3 of stake participating in the voting** is **yes** when the deadline is reached.\n' +
              '- Replace **&lt;validator-account-id&gt;** and **&lt;validator-owner-id&gt;** in the commands below with your own account IDs.\n' +
              "- [The indexer](https://thegraph.com/explorer/subgraphs/3EbPN5sxnMtSof4M8LuaSKLcNzvzDLrY3eyrRKBhVGaK?view=Query&chain=arbitrum-one) that tracks the voting results may have several minutes delay. If you don't see your vote in the details page, please refresh the page after a while.\n" +
              '\n' +
              'Vote **yes** with the below command, if you support this proposal. \n' +
              '\n' +
              '```bash\n' +
              `NEAR_ENV=${NEAR_ENV} near call ${config.proposalContractId} vote '{"staking_pool_id":"<validator-account-id>","vote":"yes"}' --accountId <validator-owner-id> --gas 200000000000000\n` +
              '```\n' +
              'Vote **no** with the below command, if you are against this proposal. \n' +
              '\n' +
              '```bash\n' +
              `NEAR_ENV=${NEAR_ENV} near call ${config.proposalContractId} vote '{"staking_pool_id":"<validator-account-id>","vote":"no"}' --accountId <validator-owner-id> --gas 200000000000000\n` +
              '```\n'
            }
          />
        </div>
      </div>
    </div>
  );
}
