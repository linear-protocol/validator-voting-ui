import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GlobalLayout from '@/layouts/global';
import Home from '@/pages/home';

export default function AppRouter() {
  return (
    <Router>
      <GlobalLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Fallback />} />
        </Routes>
      </GlobalLayout>
    </Router>
  );
}

const Fallback = () => {
  return (
    <div className="h-[70vh] flex justify-center items-start pt-20">
      <h1 className="text-5xl font-bold">404 Not Found</h1>
    </div>
  );
};
