import Big from 'big.js';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInterval } from 'react-use';

import useNear from '@/hooks/useNear';
import { logger } from '@/lib/logger';

const contractId = 'mock-proposal.testnet';

export default function useHomePage() {
  const { viewFunction } = useNear();

  const [ready, setReady] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [votes, setVotes] = useState<Record<string, string>[]>([]);
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
  const [votedStakeAmount, setVotedStakeAmount] = useState(Big(0));
  const [totalVotedStakeAmount, setTotalVotedStakeAmount] = useState(Big(0));

  const votedPercent = useMemo(() => {
    if (!totalVotedStakeAmount) return '0';
    if (totalVotedStakeAmount.eq(0)) return '0';
    return votedStakeAmount.div(totalVotedStakeAmount).times(100).toFixed(2) || '0';
  }, [votedStakeAmount, totalVotedStakeAmount]);

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
  }, [viewFunction]);

  const getVotes = useCallback(async () => {
    const data = await viewFunction({
      contractId: contractId,
      method: 'get_votes',
    });
    logger.debug('get_votes', data);
    setVotes(data || {});
  }, [viewFunction]);

  const getDeadline = useCallback(async () => {
    const data = await viewFunction({
      contractId: contractId,
      method: 'get_deadline_timestamp',
    });
    logger.debug('get_deadline_timestamp', data);
    if (!data) return;
    setDeadline(data);
    const now = dayjs();
    const then = dayjs(data);
    const diff = now.isBefore(then) ? then.diff(now) : now.diff(then);
    const diffSeconds = Math.floor(diff / 1000);
    setCountdownSeconds(diffSeconds);
  }, [viewFunction]);

  // const getProposal = useCallback(async () => {
  //   const data = await viewFunction({
  //     contractId: contractId,
  //     method: 'get_proposal',
  //   });
  //   logger.debug('get_proposal', data);
  // }, [viewFunction]);

  useEffect(() => {
    Promise.all([getTotalVotedStake(), getResult(), getVotes(), getDeadline()])
      .then(() => {
        setReady(true);
      })
      .catch((e) => {
        logger.error('Failed to fetch data', e);
        setReady(false);
      });
  }, [getTotalVotedStake, getResult, getVotes, getDeadline]);

  useInterval(
    () => {
      if (!deadline) return;
      setCountdownSeconds((s) => (s ? s - 1 : s));
    },
    deadline ? 1000 : null,
  );

  return {
    ready,
    votes,
    votedPercent,
    deadline,
    deadlineFromNow,
    votedStakeAmount,
    totalVotedStakeAmount,
  };
}
