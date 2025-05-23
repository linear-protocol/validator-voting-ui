import '@/index.css';

import { createRoot } from 'react-dom/client';

import App from '@/App.tsx';
import { Logger } from '@/lib/logger';

Logger.initialize(false);

createRoot(document.getElementById('root')!).render(<App />);
