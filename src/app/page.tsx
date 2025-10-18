'use client';

import { PauseTracker } from '@/app/components/pause-tracker';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '@/app/components/settings-sheet';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { usePremium } from '@/hooks/use-premium';
import { MainSidebar } from './components/main-sidebar';
import { FooterWithAd } from './components/footer-with-ad';
import { WelcomeOverlay } from './components/welcome-overlay';
import { useEffect } from 'react';
import { useAchievements } from '@/hooks/use-achievements-provider';

export default function Home() {
  const { isPremium } = usePremium();
  const { trackAppUsage } = useAchievements();

  useEffect(() => {
    trackAppUsage();
  }, [trackAppUsage]);

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
          <header className="w-full p-4 sm:p-6 flex items-center justify-between flex-shrink-0 border-b">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger className="md:hidden flex-shrink-0">
                <Icons.Menu />
              </SidebarTrigger>
              <Icons.Truck className="h-6 w-6 text-primary flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                TachoPause {isPremium ? <span className='text-primary'>Premium</span> : <span>Optimizer</span>}
              </h1>
            </div>
            <SettingsSheet />
          </header>
          
          <main className="flex flex-1 items-center justify-center w-full px-4 overflow-y-auto">
            <PauseTracker />
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
      </SidebarInset>
      
      <WelcomeOverlay />
    </SidebarProvider>
  );
}
