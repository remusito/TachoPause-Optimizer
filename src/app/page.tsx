'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { SettingsSheet } from '@/app/components/settings-sheet';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function HomePage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
          <header className="w-full p-4 sm:p-6 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden">
                <Icons.Menu />
              </SidebarTrigger>
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold">TachoPause Optimizer</h1>
            </div>
            <SettingsSheet />
          </header>
          <main className="flex-1 w-full p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bienvenido a TachoPause Optimizer</CardTitle>
                  <CardDescription>
                    Gestiona tus puntos de carga y descarga de manera eficiente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explora la lista de cargas disponibles o agrega una nueva.
                  </p>
                  <Button asChild>
                    <Link href="/loads">Ver Cargas</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
