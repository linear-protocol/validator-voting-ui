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
