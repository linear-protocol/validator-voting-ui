import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import VoteContainer from '@/containers/vote';
import GlobalLayout from '@/layouts/global';
import Details from '@/pages/details';
import Home from '@/pages/home';

export default function AppRouter() {
  return (
    <Router>
      <VoteContainer.Provider>
        <GlobalLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details" element={<Details />} />
            <Route path="*" element={<Fallback />} />
          </Routes>
        </GlobalLayout>
      </VoteContainer.Provider>
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
