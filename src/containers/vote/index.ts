import Big from 'big.js';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

import config from '@/config';
import { createContainer } from '@/hooks/useContainer';
import useNear from '@/hooks/useNear';
import { logger } from '@/lib/logger';

interface VoteState {
  isLoading: boolean;
  deadline: number | null;
  voteFinishedAt: number | null;
  votes: Record<string, string>;
  votedStakeAmount: Big.Big;
  totalVotedStakeAmount: Big.Big;
}

interface VoteComputed {
  votedPercent: string;
  progressList: number[];
}

const PROGRESS = [66.67];

type UseVoteContainer = VoteState & VoteComputed;
const contractId = config.proposalContractId;

function useVoteContainer(): UseVoteContainer {
  const { viewFunction } = useNear();

  const [deadline, setDeadline] = useState<number | null>(null);
  const [voteFinishedAt, setVoteFinishedAt] = useState<number | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [votedStakeAmount, setVotedStakeAmount] = useState(Big(0));
  const [totalVotedStakeAmount, setTotalVotedStakeAmount] = useState(Big(0));

  const _votedPercent = useMemo(() => {
    if (!totalVotedStakeAmount) return '0';
    if (totalVotedStakeAmount.eq(0)) return '0';
    return votedStakeAmount.div(totalVotedStakeAmount).times(100).toFixed(2) || '0';
  }, [votedStakeAmount, totalVotedStakeAmount]);

  const votedPercent = useMemo(() => {
    const _percent = Number(_votedPercent);
    const lastProgress = PROGRESS[PROGRESS.length - 1];
    if (voteFinishedAt) {
      if (_percent >= lastProgress) return _votedPercent;
      return lastProgress.toFixed(2);
    }
    return _votedPercent;
  }, [_votedPercent, voteFinishedAt]);

  const getTotalVotedStake = useCallback(async () => {
    const data = await viewFunction({
      contractId: contractId,
      method: 'get_total_voted_stake',
    });
    logger.debug('get_total_voted_stake', data);
    if (!Array.isArray(data) && data.length !== 2) {
      logger.error('get_total_voted_stake error', data);
      return;
    }
    setVotedStakeAmount(Big(data[0]));
    setTotalVotedStakeAmount(Big(data[1]));
  }, [viewFunction]);

  const getResult = useCallback(async () => {
    const data = await viewFunction({
      contractId: contractId,
      method: 'get_result',
    });
    logger.debug('get_result', data);
    setVoteFinishedAt(data || null);
  }, [viewFunction]);

  const getVotes = useCallback(async () => {
    const data = await viewFunction({
      contractId: contractId,
      method: 'get_votes',
    });
    logger.debug('get_votes', data);
    setVotes(data || []);
  }, [viewFunction]);

  const getDeadline = useCallback(async () => {
    const data = await viewFunction({
      contractId: contractId,
      method: 'get_deadline_timestamp',
    });
    logger.debug('get_deadline_timestamp', data);
    setDeadline(data || null);
  }, [viewFunction]);

  // const getProposal = useCallback(async () => {
  //   const data = await viewFunction({
  //     contractId: contractId,
  //     method: 'get_proposal',
  //   });
  //   logger.debug('get_proposal', data);
  // }, [viewFunction]);

  const { isLoading } = useSWR(
    'vote_data',
    async () => {
      const promises = Promise.all([getTotalVotedStake(), getResult(), getVotes(), getDeadline()]);
      return await promises;
    },
    // {
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    // },
  );

  return {
    isLoading,
    deadline,
    voteFinishedAt,
    votes,
    votedStakeAmount,
    totalVotedStakeAmount,
    votedPercent,
    progressList: PROGRESS,
  };
}

const VoteContainer = createContainer(useVoteContainer);

export default VoteContainer;
