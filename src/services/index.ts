import axios from 'axios';

import config from '@/config';

interface ApiResponse<T> {
  result: {
    data: T;
  };
}

export interface ValidatorMetadata {
  accountId: string;
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  country?: string;
  country_code?: string;
  email?: string;
  telegram?: string;
  twitter?: string;
  github?: string;
}

export interface ValidatorItem {
  id: string;
  accountId: string;
  choice: 'yes' | 'no';
  lastVoteTimestamp: string;
  lastVoteReceiptHash: string;
  metadata?: ValidatorMetadata;
}

export async function getValidators(): Promise<ValidatorItem[]> {
  const resp = await axios.get<ApiResponse<ValidatorItem[]>>('/getValidators', {
    baseURL: config.validatorApi,
  });
  return resp.data?.result?.data || [];
}
