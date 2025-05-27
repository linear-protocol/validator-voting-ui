import Big from 'big.js';
import dayjs from 'dayjs';
import { ArrowLeft, MoveDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GreenCheck from '@/assets/icons/green-check.svg?react';
import RightTopArrow from '@/assets/icons/right-top-arrow.svg?react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import config from '@/config';
import VoteContainer from '@/containers/vote';
import { formatBigNumber } from '@/lib/utils';
import { getValidators } from '@/services';

import type { ValidatorItem } from '@/services';

export default function Details() {
  const navigate = useNavigate();

  const { votes, totalVotedStakeAmount } = VoteContainer.useContainer();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ValidatorItem[]>([]);
  const [powerOrder, setPowerOrder] = useState<'asc' | 'desc'>('asc');

  const tableList = useMemo(() => {
    if (!list || !list.length) return [];
    if (powerOrder === 'desc') {
      return list.sort((a, b) => {
        const aVote = votes[a.accountId] || '0';
        const bVote = votes[b.accountId] || '0';
        return Big(aVote).minus(Big(bVote)).toNumber();
      });
    }

    return list.sort((a, b) => {
      const aVote = votes[a.accountId] || '0';
      const bVote = votes[b.accountId] || '0';
      return Big(bVote).minus(Big(aVote)).toNumber();
    });
  }, [list, powerOrder, votes]);

  const getPercent = (n: string | number) => {
    if (!totalVotedStakeAmount || !n) return '0';
    if (Big(totalVotedStakeAmount).eq(0)) return '0';
    return Big(n).div(totalVotedStakeAmount).times(100).toFixed(2);
  };

  const getNearBlocksLink = (hash: string) => {
    if (!hash) return '';
    if (config.near.network.networkId === 'testnet') {
      return `https://testnet.nearblocks.io/hash/${hash}`;
    }
    return `https://nearblocks.io/hash/${hash}`;
  };

  useEffect(() => {
    setLoading(true);
    getValidators()
      .then((data) => {
        setList(data);
      })
      .catch((error) => {
        console.error('Failed to fetch validators:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col w-full px-4 sm:px-8 pb-20">
      <div className="flex items-center mb-5">
        <div
          className="border flex cursor-pointer hover:opacity-75 items-center justify-center w-9 h-9 rounded-lg border-app-black-120"
          onClick={(ev) => {
            ev.stopPropagation();
            navigate('/');
          }}
        >
          <ArrowLeft />
        </div>
      </div>
      <div className="flex flex-col w-full text-app-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Validator</TableHead>
              <TableHead>Choice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right cursor-pointer">
                <div
                  className="flex items-center justify-end gap-0.5"
                  onClick={() => setPowerOrder(powerOrder === 'asc' ? 'desc' : 'asc')}
                >
                  Voting Power
                  {powerOrder === 'asc' ? (
                    <MoveDown className="h-4" />
                  ) : (
                    <MoveDown className="rotate-180 h-4" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableList.map((item) => {
              const voteData = votes[item.accountId] || '0';
              const num = voteData ? formatBigNumber(voteData, 24) : '0';
              const percent = getPercent(voteData);
              const relativeTime = dayjs(item.lastVoteTimestamp).fromNow();

              return (
                <TableRow key={item.id}>
                  <TableCell className="h-[60px] flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={item.metadata?.logo} alt={item.metadata?.name} />
                      <AvatarFallback>
                        {item.metadata?.name || item.accountId.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {item.accountId}
                  </TableCell>
                  <TableCell className="h-[60px]">
                    <a
                      href={getNearBlocksLink(item.lastVoteReceiptHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-app-blue hover:underline flex items-center gap-1.5"
                    >
                      <GreenCheck className="-mt-1" />
                      YAE
                      <RightTopArrow />
                    </a>
                  </TableCell>
                  <TableCell className="h-[60px] py-0">
                    <div className="text-base mb-1">{relativeTime}</div>
                    <div className="text-app-black-800 text-xs">
                      {dayjs(item.lastVoteTimestamp).format('MMM D, YYYY')}
                    </div>
                  </TableCell>
                  <TableCell className="h-[60px] py-0 text-right">
                    <div className="text-base mb-1">{num} NEAR</div>
                    <div className="text-app-black-800 text-xs">{percent}%</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {loading && (
          <div className="flex flex-col gap-4 mt-4">
            <Skeleton className="h-[24px]" />
            <Skeleton className="h-[24px]" />
            <Skeleton className="h-[24px]" />
          </div>
        )}
      </div>
    </div>
  );
}
