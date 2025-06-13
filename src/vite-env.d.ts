/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NEAR_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg?react' {
  import type * as React from 'react';

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
