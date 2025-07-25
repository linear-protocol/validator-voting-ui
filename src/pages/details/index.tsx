import Big from 'big.js';
import dayjs from 'dayjs';
import { ArrowLeft, CircleCheck, CircleX, MoveDown, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RightTopArrow from '@/assets/icons/right-top-arrow.svg?react';
import AvatarImg from '@/assets/images/avatar.jpg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import config from '@/config';
import VoteContainer from '@/containers/vote';
import { formatBigNumber } from '@/lib/utils';
import { getValidators } from '@/services';

import type { ValidatorItem } from '@/services';

interface VotingPowerItem {
  isYesVote: boolean;
  power: string;
  formattedPower: string;
  percent: string;
}

export default function Details() {
  const navigate = useNavigate();

  const { isLoading: voteDataLoading, votes, totalStakeAmount } = VoteContainer.useContainer();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ValidatorItem[]>([]);
  const [powerOrder, setPowerOrder] = useState<'asc' | 'desc' | undefined>();
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc' | undefined>('desc');

  const tableList = useMemo(() => {
    if (!list || !list.length) return [];
    // const _list = list.filter((item) => {
    //   return votes[item.accountId] !== undefined;
    // });

    return list.sort((a, b) => {
      const aVote =
        a.vote === 'yes'
          ? votes[a.accountId]
            ? votes[a.accountId][1]
            : '0'
          : a.totalStakedBalance;
      const bVote =
        b.vote === 'yes'
          ? votes[b.accountId]
            ? votes[b.accountId][1]
            : '0'
          : b.totalStakedBalance;
      const aDate = a.lastVoteTimestamp || 0;
      const bDate = b.lastVoteTimestamp || 0;

      if (powerOrder) {
        if (powerOrder === 'desc') {
          return Big(bVote).minus(Big(aVote)).toNumber();
        }
        return Big(aVote).minus(Big(bVote)).toNumber();
      }

      if (dateOrder) {
        if (dateOrder === 'desc') {
          return aDate > bDate ? -1 : 1;
        }
        return bDate > aDate ? -1 : 1;
      }

      return 1;
    });
  }, [list, votes, powerOrder, dateOrder]);

  const getPercent = useCallback(
    (n: string | number) => {
      if (!totalStakeAmount || !n) return '0';
      if (Big(totalStakeAmount).eq(0)) return '0';
      return Big(n).div(totalStakeAmount).times(100).toFixed(2);
    },
    [totalStakeAmount],
  );

  const votingPowerMap: Record<string, VotingPowerItem> = useMemo(() => {
    const data: Record<string, VotingPowerItem> = {};
    tableList.forEach((item) => {
      const isYesVote = item.vote === 'yes';
      let power = votes[item.accountId] ? votes[item.accountId][1] : '0';
      if (!isYesVote) {
        power = item.totalStakedBalance || '0';
      }

      const formattedPower = power ? formatBigNumber(power, 24) : '0';
      const percent = getPercent(power);

      data[item.accountId] = {
        isYesVote,
        power,
        formattedPower,
        percent,
      };
    });
    return data;
  }, [tableList, votes, getPercent]);

  const totalVotingPowerPercent = useMemo(() => {
    const yesTotalPercent = Object.values(votingPowerMap)
      .filter((item) => item.percent && item.isYesVote)
      .reduce((acc, item) => acc.plus(item.percent), Big(0));
    const yesTotal = Object.values(votingPowerMap)
      .filter((item) => item.isYesVote)
      .reduce((acc, item) => acc.plus(item.power), Big(0));
    const noTotalPercent = Object.values(votingPowerMap)
      .filter((item) => item.percent && !item.isYesVote)
      .reduce((acc, item) => acc.plus(item.percent), Big(0));
    const noTotal = Object.values(votingPowerMap)
      .filter((item) => !item.isYesVote)
      .reduce((acc, item) => acc.plus(item.power), Big(0));

    return {
      yesPercent: yesTotalPercent.toFixed(2),
      yesTotal: formatBigNumber(yesTotal),
      noPercent: noTotalPercent.toFixed(2),
      noTotal: formatBigNumber(noTotal),
    };
  }, [votingPowerMap]);

  const getNearBlocksLink = (hash: string) => {
    if (!hash) return '';
    if (config.near.network.networkId === 'testnet') {
      return `https://testnet.nearblocks.io/hash/${hash}`;
    }
    return `https://nearblocks.io/hash/${hash}`;
  };

  const renderOrderIcon = (order: 'asc' | 'desc' | undefined) => {
    if (order === 'desc') {
      return <MoveDown className="h-4" />;
    } else if (order === 'asc') {
      return <MoveDown className="rotate-180 h-4" />;
    }
    return <MoveDown className="h-4 opacity-25" />;
  };

  useEffect(() => {
    setLoading(true);
    getValidators()
      .then((data) => {
        setList(data || []);
      })
      .catch((error) => {
        console.error('Failed to fetch validators:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const tableLoading = loading || voteDataLoading;

  return (
    <div className="flex flex-col w-full flex-1 px-4 sm:px-8 pb-20 min-h-[400px]">
      <div className="flex items-center justify-between mb-5">
        <div
          className="border flex cursor-pointer hover:opacity-75 items-center justify-center w-9 h-9 rounded-lg border-app-black-120"
          onClick={(ev) => {
            ev.stopPropagation();
            navigate('/');
          }}
        >
          <ArrowLeft />
        </div>
        <div className="flex flex-col font-normal text-sm min-w-[200px]">
          <div className="flex items-center justify-between text-[#00A40E] mb-1.5">
            <div className="flex items-center gap-2 flex-1 justify-between">
              <span className="mr-2">YEA</span>
              {totalVotingPowerPercent.yesTotal} NEAR
            </div>
            <div className="ml-10">{totalVotingPowerPercent.yesPercent}%</div>
          </div>
          <div className="flex items-center justify-between text-red-500">
            <div className="flex items-center gap-2 flex-1 justify-between">
              <span className="mr-2">NAY</span>
              {totalVotingPowerPercent.noTotal} NEAR
            </div>
            <div className="ml-10">{totalVotingPowerPercent.noPercent}%</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full text-app-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Validator</TableHead>
              <TableHead>Vote</TableHead>
              <TableHead className="cursor-pointer">
                <div
                  className="flex items-center gap-0.5 min-w-[150px]"
                  onClick={() => {
                    setPowerOrder(undefined);
                    setDateOrder(dateOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Date
                  {renderOrderIcon(dateOrder)}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer">
                <div
                  className="flex items-center justify-end gap-0.5 min-w-[150px]"
                  onClick={() => {
                    setDateOrder(undefined);
                    setPowerOrder(powerOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Voting Power
                  {renderOrderIcon(powerOrder)}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          {!tableLoading && (
            <TableBody>
              {tableList.map((item) => {
                const isYesVote = item.vote === 'yes';
                const votingPower = votingPowerMap[item.accountId];
                const relativeTime = dayjs(item.lastVoteTimestamp).fromNow();

                return (
                  <TableRow key={item.id}>
                    <TableCell className="h-[60px] flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={item.metadata?.logo || AvatarImg}
                          alt={item.metadata?.name}
                        />
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
                        {isYesVote ? (
                          <CircleCheck className="-mt-0.5 w-6 h-6 fill-[#00A40E] stroke-white" />
                        ) : (
                          <CircleX className="-mt-0.5 w-6 h-6 fill-red-500 stroke-white" />
                        )}
                        {isYesVote ? 'YEA' : 'NAY'}
                        <RightTopArrow />
                      </a>
                    </TableCell>
                    <TableCell className="h-[60px] py-0">
                      <div className="text-base mb-1">{relativeTime}</div>
                      <div className="text-app-black-800 text-xs">
                        {dayjs(item.lastVoteTimestamp).format('MMM D, YYYY')}
                      </div>
                    </TableCell>
                    <TableCell
                      className="h-[60px] py-0 text-right"
                      data-state={JSON.stringify(votingPower)}
                      data-vote={votes[item.accountId]}
                    >
                      <div className="text-base mb-1">{votingPower?.formattedPower || 0} NEAR</div>
                      <div className="text-app-black-800 text-xs">{votingPower?.percent || 0}%</div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
        {tableLoading && (
          <div className="flex flex-col gap-4 mt-4">
            <Skeleton className="h-[24px]" />
            <Skeleton className="h-[24px]" />
            <Skeleton className="h-[24px]" />
          </div>
        )}
        {!tableLoading && tableList.length === 0 && (
          <div className="flex flex-col items-center w-full text-base text-app-secondary pt-[300px]">
            <Search className="mb-2" />
            <p>No voter yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
