'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '../components/settings-sheet';
import { FooterWithAd } from '../components/footer-with-ad';
import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegulationsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground"> {/* ❌ Sidebar eliminado, ✅ Flex column */}
      <header className="w-full p-4 sm:p-6 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold">Reglamento</h1>
        </div>
        <SettingsSheet />
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6"> {/* ✅ Contenido centrado */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reglamento de Tacógrafos y Tiempos de Conducción</CardTitle>
              <CardDescription>
                Normativa europea (CE) 561/2006 sobre tiempos de conducción, pausas y descansos
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="driving" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="driving">Conducción</TabsTrigger>
              <TabsTrigger value="breaks">Pausas</TabsTrigger>
              <TabsTrigger value="rest">Descansos</TabsTrigger>
              <TabsTrigger value="infractions">Infracciones</TabsTrigger>
            </TabsList>

            {/* TAB: Tiempos de Conducción */}
            <TabsContent value="driving" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Tiempos Máximos de Conducción
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <h4 className="font-semibold mb-2">Conducción diaria</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Máximo 9 horas</strong> de conducción diaria</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Se puede extender a <strong>10 horas</strong> hasta <strong>2 veces por semana</strong></span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg border bg-muted/50">
                      <h4 className="font-semibold mb-2">Conducción semanal</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Máximo 56 horas</strong> en una semana</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Máximo 90 horas</strong> en dos semanas consecutivas</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <h4 className="font-semibold text-amber-900 dark:text-amber-100">Importante</h4>
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            La conducción ininterrumpida no puede exceder las <strong>4 horas y 30 minutos</strong> sin una pausa.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Pausas */}
            <TabsContent value="breaks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.Play className="h-5 w-5 text-primary" />
                    Pausas Obligatorias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* ...contenido de pausas, igual que antes... */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Descansos */}
            <TabsContent value="rest" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.Moon className="h-5 w-5 text-primary" />
                    Descansos Diarios y Semanales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* ...contenido de descansos, igual que antes... */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Infracciones */}
            <TabsContent value="infractions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Infracciones y Sanciones
                  </CardTitle>
                  <CardDescription>
                    Principales infracciones relacionadas con el tacógrafo y tiempos de conducción
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* ...contenido de infracciones, igual que antes... */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icons.BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-semibold">Referencias legales</h4>
                  <p className="text-sm text-muted-foreground">
                    Reglamento (CE) nº 561/2006 del Parlamento Europeo y del Consejo, de 15 de marzo de 2006, 
                    relativo a la armonización de determinadas disposiciones en materia social en el sector de los transportes por carretera.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FooterWithAd />
    </div>
  );
}
