'use client';

import { PauseTracker } from '@/app/components/pause-tracker';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '@/app/components/settings-sheet';
import { usePremium } from '@/hooks/use-premium';
import { MainSidebar } from '@/components/ui/sidebar';
import { FooterWithAd } from './components/footer-with-ad';
import { WelcomeOverlay } from './components/welcome-overlay';
import { useEffect, useState } from 'react';
import { useAchievements } from '@/hooks/use-achievements-provider';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { isPremium } = usePremium();
  const { trackAppUsage } = useAchievements();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    trackAppUsage();
  }, [trackAppUsage]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-dvh">
      <MainSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col bg-background text-foreground overflow-hidden">
        <header className="w-full p-4 sm:p-6 flex items-center justify-between flex-shrink-0 border-b">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" className="md:hidden" onClick={toggleSidebar}>
              <Icons.Menu className="h-6 w-6" />
            </Button>
            <Icons.Truck className="h-6 w-6 text-primary flex-shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
              TachoPause {isPremium ? <span className='text-primary'>Premium</span> : <span>Optimizer</span>}
            </h1>
          </div>
          <SettingsSheet />
        </header>
        
        <main className="flex flex-1 items-center justify-center w-full px-4 sm:px-6 overflow-y-auto">
          <div className="w-full max-w-md flex justify-center">
            <PauseTracker />
          </div>
        </main>
        
        {!isPremium && (
          <div className="w-full text-center py-2 flex-shrink-0">
            <p className="text-xs text-muted-foreground">
              Hecho con ❤️ para los héroes de la carretera.
            </p>
          </div>
        )}
        
        <div className="flex-shrink-0">
          <FooterWithAd />
        </div>
      </div>
      
      <WelcomeOverlay />
    </div>
  );
}
