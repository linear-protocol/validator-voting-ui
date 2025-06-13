import testnet from './testnet';
import mainnet from './mainnet';

export const nearEnv = import.meta.env.VITE_APP_NEAR_ENV;
export default {
  testnet,
  mainnet,
}[nearEnv] || testnet;
