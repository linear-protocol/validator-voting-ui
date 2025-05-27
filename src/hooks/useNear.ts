import { providers } from 'near-api-js';
import { useCallback } from 'react';

import config from '@/config';
import { logger } from '@/lib/logger';

interface ViewMethodParams {
  contractId: string;
  method: string;
  args?: Record<string, unknown>;
}

export interface CallMethodParams extends ViewMethodParams {
  gas?: string | number | bigint;
  deposit?: string | bigint;
}

export default function useNear() {
  const viewFunction = useCallback(async ({ contractId, method, args = {} }: ViewMethodParams) => {
    try {
      const provider = new providers.JsonRpcProvider({
        url: config.near.network.nodeUrl,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await provider.query<any>({
        request_type: 'call_function',
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'optimistic',
      });
      return JSON.parse(Buffer.from(res.result).toString());
    } catch (e) {
      logger.error('Failed to view function', e);
      return null;
    }
  }, []);

  return {
    viewFunction,
  };
}
