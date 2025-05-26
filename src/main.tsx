import '@/index.css';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createRoot } from 'react-dom/client';

import App from '@/App.tsx';
import { Logger } from '@/lib/logger';

dayjs.extend(relativeTime);

Logger.initialize(false);

createRoot(document.getElementById('root')!).render(<App />);
