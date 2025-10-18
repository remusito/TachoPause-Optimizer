'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '../components/settings-sheet';
import { MainSidebar } from '@/components/ui/sidebar';
import { FooterWithAd } from '../components/footer-with-ad';
import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegulationsPage() {
  return (
    <div className="flex min-h-dvh">
      <MainSidebar />
      <div className="flex-1 flex flex-col bg-background text-foreground">
        <header className="w-full p-4 sm:p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">Reglamento</h1>
          </div>
          <SettingsSheet />
        </header>

        <main className="flex-1 w-full p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
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
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border bg-muted/50">
                        <h4 className="font-semibold mb-2">Pausa después de 4,5 horas</h4>
                        <p className="text-sm mb-3">
                          Después de <strong>4 horas y 30 minutos</strong> de conducción ininterrumpida, debes hacer una pausa de:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span><strong>Al menos 45 minutos continuos</strong></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>O puedes dividirla en: <strong>15 minutos</strong> + <strong>30 minutos</strong> (debe sumar 45 minutos mínimo)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg border bg-primary/5">
                        <h4 className="font-semibold mb-2 text-primary">💡 Regla del minuto extra</h4>
                        <p className="text-sm">
                          Si haces una pausa de <strong>46 minutos o más</strong>, el tacógrafo considera que has hecho el descanso completo de 45 minutos, permitiéndote conducir otras 4,5 horas sin necesidad de dividir la pausa.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100">Atención</h4>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Si divides la pausa, la <strong>primera parte debe ser de al menos 15 minutos</strong> y la <strong>segunda de al menos 30 minutos</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border bg-muted/50">
                        <h4 className="font-semibold mb-2">Descanso diario</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span><strong>Normal:</strong> 11 horas de descanso continuo (puede reducirse a 9 horas, máximo 3 veces por semana)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span><strong>Dividido:</strong> 3 horas + 9 horas (dentro de un periodo de 24 horas)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg border bg-muted/50">
                        <h4 className="font-semibold mb-2">Descanso semanal</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span><strong>Regular:</strong> 45 horas continuas (puede reducirse a 24 horas, compensando antes del final de la tercera semana siguiente)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span><strong>Reducido:</strong> Mínimo 24 horas (debe compensarse)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>Debe tomarse después de <strong>máximo 6 jornadas de trabajo</strong></span>
                          </li>
                        </ul>
                      </div>
                    </div>
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
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
                        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Infracciones muy graves</h4>
                        <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                          <li>• Manipulación del tacógrafo: <strong>Multa hasta 6.000€</strong></li>
                          <li>• No llevar tacógrafo en funcionamiento: <strong>Multa hasta 4.000€</strong></li>
                          <li>• Exceder en más del 50% los tiempos de conducción: <strong>Multa hasta 4.000€</strong></li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
                        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Infracciones graves</h4>
                        <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                          <li>• Exceder los tiempos de conducción: <strong>Multa hasta 2.000€</strong></li>
                          <li>• No respetar las pausas obligatorias: <strong>Multa hasta 2.000€</strong></li>
                          <li>• No respetar los descansos diarios: <strong>Multa hasta 2.000€</strong></li>
                          <li>• Tarjeta de tacógrafo caducada: <strong>Multa hasta 2.000€</strong></li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Infracciones leves</h4>
                        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                          <li>• No llevar impresos de actividad: <strong>Multa hasta 200€</strong></li>
                          <li>• Introducción incorrecta de datos: <strong>Multa hasta 200€</strong></li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg border bg-muted/50">
                        <p className="text-sm text-muted-foreground">
                          <strong>Nota:</strong> Las sanciones pueden variar según la legislación de cada país. 
                          Consulta siempre la normativa vigente en tu región.
                        </p>
                      </div>
                    </div>
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
    </div>
  );
}
