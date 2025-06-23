import Big from 'big.js';
import type { BigSource, RoundingMode } from 'big.js';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBigNumber(num: Big.Big | string | number, decimals = 24): string {
  if (!num) return '0.00';
  const _num = Big(num);
  if (_num.eq(0)) return '0.00';
  const bigNum = Big(_num).div(Big(10).pow(decimals));
  const numStr = bigNum.toFixed();
  const len = numStr.replace(/\D/g, '').length;

  let unit = '';
  let result = bigNum;

  if (len > 12) {
    unit = 'T'; // Trillions
    result = bigNum.div(Big('1e12'));
  } else if (len > 9) {
    unit = 'B'; // Billions
    result = bigNum.div(Big('1e9'));
  } else if (len > 6) {
    unit = 'M'; // Millions
    result = bigNum.div(Big('1e6'));
  } else if (len > 3) {
    unit = 'K'; // Thousands
    result = bigNum.div(Big('1e3'));
  }

  if (result.lt(1)) {
    return toLocaleString(bigNum, 2);
  }
  return toLocaleString(result, 2) + unit;
}

export default function toLocaleString(
  source: BigSource,
  decimals?: number,
  dp?: RoundingMode, // only for Big type
): string {
  if (typeof source === 'string') {
    return toLocaleString(Number(source), decimals);
  } else if (typeof source === 'number') {
    return decimals !== undefined
      ? source.toLocaleString(undefined, {
          maximumFractionDigits: decimals,
          minimumFractionDigits: decimals,
        })
      : source.toLocaleString();
  } else {
    // Big type
    return toLocaleString(
      decimals !== undefined ? Number(source.toFixed(decimals, dp)) : source.toNumber(),
      decimals,
    );
  }
}
