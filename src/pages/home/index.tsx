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
            content={`# Proposal: Dynamic Inflation Model for NEAR Protocol

              ## Context: NEAR’s Current Inflation and Drawbacks

              NEAR’s token economics currently rely on a **fixed 5% annual inflation rate** on the total token supply. This rate was set at mainnet launch with the expectation that high network usage (and fee burns) would bring net inflation down to ~2-3%. In reality, **fee burns have been minimal (only ~0.1% of supply burned over the past year)**, so nearly the full 5% inflation is hitting the supply. This translates to **over 60 million new NEAR tokens minted each year**, significantly expanding the supply. Such **excess inflation dilutes existing holders and gradually devalues the NEAR token price**.

              Key issues with the status quo include:

              * **Excessive Net Inflation:** With low fees burned, net inflation remains ~4.9% (out of 5%), far above the intended 2-3% range. This adds tens of millions of NEAR to circulation yearly, outpacing network growth.  
              * **Token Dilution:** Continual 5% supply growth (vs. only 0.1% burned) means holders’ proportional ownership is diluted over time, potentially putting downward pressure on the token’s value.  
              * **Uncompetitive Tokenomics:** Other proof-of-stake chains (e.g. **Polkadot, Solana, Aptos**) have recently recognized similar issues and proposed **inflation reductions**. NEAR risks lagging behind if we don’t adjust our inflation model to align with industry best practices.

              In summary, the current **5% fixed inflation** is **too high relative to usage**, causing unnecessary token supply growth and dilution. The NEAR community needs a more **sustainable inflation model** that curbs inflation while still rewarding stakers and securing the network.

              ## Proposed Inflation Change

              **Proposal Summary:** *Change NEAR’s maximum inflation from 5% to 2.5%*

              **Rationale:** With ~0.1% of total supply burnt in transaction fees every year, 2.5% maximum inflation would result in an actual inflation of 2.4%, which is much healthier than the 4.9% we have today and make the economics of the protocol more sustainable. In addition, the current ~9% staking yield makes it unattractive for token holders to use NEAR Defi.

              Maintaining a fixed maximum inflation rate makes it easy for the community to understand how tokenomics works and adjustment can be done on a regular basis through voting when the House of Stake is properly set up.

              **Inflation Impact:** Inflation will be reduced to roughly 2.4%. Staking yield will be reduced to 4.5% assuming 50% of the total supply is staked. If some stakers decided to withdraw their stake due to lower yield, the staking yield will increase accordingly. There will be a much stronger incentive for NEAR token holders to put $NEAR into Defi.

              ## Urgency and Path to Execution

              **Why Now?** Reducing NEAR’s inflation is an urgent priority. Every additional month of the status quo means **millions of new NEAR entering circulation**, which is not only dilutive but also unnecessary given the low fee burn. **High inflation without high usage is unsustainable.** Furthermore, with **multiple other networks already taking action to lower inflation**, it’s crucial for NEAR to **move quickly** or risk having a less attractive token economy for investors and users. This proposal addresses a core economic concern and aligns NEAR with a healthier, leaner inflation level sooner rather than later.

              **Governance Process:** To enact this change, the proposal will proceed through NEAR’s governance framework, albeit with some adaptations given current limitations:

              * **Community-Driven Initiative:** This idea originates from community and ecosystem discussions about improving NEAR’s economics. We encourage well-known ecosystem participants (major validators, projects, or investors) to **sponsor and champion** the proposal when it goes up for a vote, demonstrating broad support.  
              * **Validator Vote:** Because NEAR’s on-chain governance (e.g. the **House of Stake** framework) is still in development and **won’t be fully operational for ~6 months**, we will use an **interim voting mechanism** for this decision. The plan is to implement a **special smart contract for delegated voting by validators** . In practice, each validator (and by extension their delegators) can cast a vote on the proposal through this contract, weighted by stake. A simple web frontend or dashboard will be provided to track votes and allow validators to participate easily . This method leverages our validator community’s consensus as the decision-making process, until formal governance is available. After the House of Stake is properly set up, it will conduct review and voting for changes to the maximum inflation on a regular basis.  
              * **Timeline:** The targeted timeline is as follows (subject to community feedback):  
              1. **Discussion (Now-Next Few Weeks):** Open community discussion on this forum post. We will incorporate feedback, address questions, and refine the proposal details.  
              2. **Final Proposal & Off-Chain Vote Setup (June 2025):** Based on community consensus, finalize the proposal text and technical implementation plan. Simultaneously, deploy the validator voting smart contract and prepare the voting interface.  
              3. **Validator Voting Period (Summer 2025):** Conduct a formal **validator vote** (over a predefined period, e.g. 1-2 weeks) on adopting the dynamic inflation model. This would be well **before the House of Stake launch**, to not delay the benefits of inflation reduction.  
              4. **Result & Implementation:** If the vote **passes with the required majority**, core developers will include the new inflation logic in the next protocol upgrade release. The change could be **activated in the network by late Q3 2025**, assuming a smooth voting process and technical rollout. (If the proposal is rejected, the community can discuss further refinements or alternatives.)

              Throughout this process, we will also be raising awareness and educating the community. Expect **announcements, AMAs, and documentation** explaining the proposal’s details. Validator and community buy-in is crucial, so we want to ensure everyone understands **why this change is beneficial for NEAR’s future**.

              ## Conclusion and Call to Action

              In conclusion, **adopting a change to the inflation model is a critical upgrade to NEAR’s economics**. It will **substantially reduce inflation** (from the current effective ~5% down to ~2.5%) while **preserving strong staking incentives** and network security.

              Such a change puts NEAR in line with other leading blockchains that are optimizing their tokenomics, and it showcases our community’s proactiveness in responding to economic realities. **Lower inflation and controlled token issuance will enhance confidence in NEAR**, benefiting all stakeholders by reducing unnecessary dilution and potentially supporting a more robust token value.

              **Call to Action:** We urge all NEAR community members, validators, and token holders to **support this proposal**. Engage in the discussion, ask questions, and help us fine-tune the details. Your feedback is valuable to ensure we get this right. If you agree that NEAR’s inflation should be made dynamic and reduced, please voice your support.

              With consensus, we aim to move to the formal validator vote soon. **Let’s work together to implement this improvement to NEAR’s economics, strengthening the network’s viability and competitiveness for years to come.**

              *Thank you for your consideration, and we look forward to your input on this proposal.*

              `}
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
