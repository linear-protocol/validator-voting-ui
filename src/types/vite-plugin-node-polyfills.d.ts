declare module 'vite-plugin-node-polyfills' {
  import { Plugin } from 'vite';

  interface NodePolyfillsOptions {
    globals?: {
      Buffer?: boolean;
      global?: boolean;
      process?: boolean;
    };
    protocolImports?: boolean;
  }

  export function nodePolyfills(options?: NodePolyfillsOptions): Plugin;
}
