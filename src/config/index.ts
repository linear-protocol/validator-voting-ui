import testnet from './testnet';
import mainnet from './mainnet';

const nearEnv = import.meta.env.VITE_APP_NEAR_ENV;
export const isMainnet = nearEnv === 'mainnet';

export default {
  testnet,
  mainnet,
}[nearEnv] || testnet;
