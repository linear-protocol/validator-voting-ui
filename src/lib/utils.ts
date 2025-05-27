import Big from 'big.js';
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
    return bigNum.toFixed(2);
  }
  return result.toFixed(2) + unit;
}

const testNumbers = [
  '0',
  '1000000000000000000000000',
  '2000000000000000000000000',
  '20000000000000000000000000',
  '212100000000000000000000000',
  '1000000000000000000000000000',
  '10000000000000000000000000000',
  '100000000000000000000000000000',
  '1000000000000000000000000000000',
  '10000000000000000000000000000000',
  '100000000000000000000000000000000',
  '1000000000000000000000000000000000',
  '10000000000000000000000000000000000',
  '100000000000000000000000000000000000',
  '1000000000000000000000000000000000000',
  '10000000000000000000000000000000000000',
  '100000000000000000000000000000000000000',
  '1000000000000000000000000000000000000000',
];
testNumbers.forEach((num) => {
  console.log(`Formatted ${num}:`, formatBigNumber(num));
});
