import { Toaster } from '@/components/ui/sonner';
import Footer from './footer';
import Header from './header';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
      <Toaster />
    </div>
  );
}
