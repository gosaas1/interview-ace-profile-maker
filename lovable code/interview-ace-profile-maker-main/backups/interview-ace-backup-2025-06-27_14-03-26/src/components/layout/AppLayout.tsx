import { TopNavigation } from '@/components/navigation/TopNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  showTopNav?: boolean;
}

export function AppLayout({ children, showTopNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showTopNav && <TopNavigation />}
      <main className={showTopNav ? "pt-0" : ""}>
        {children}
      </main>
    </div>
  );
} 