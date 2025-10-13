'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SettingsSheet } from '../../components/settings-sheet';
import { MainSidebar } from '../../components/main-sidebar';
import { useAuth } from '@/firebase';
import { useFirebase } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export default function AddLoadPage() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    material: '',
    radioChannel: '',
    phone: '',
    schedule: '',
    location: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !firestore) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para agregar información.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name.trim() || !formData.material.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'El nombre y el material son obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const loadsRef = collection(firestore, 'loads');
      await addDoc(loadsRef, {
        ...formData,
        userId: user.uid,
        createdBy: user.email || user.displayName || 'Usuario',
        createdAt: serverTimestamp(),
      });

      toast({
        title: '✅ Carga agregada',
        description: 'La información se ha guardado correctamente.',
      });

      router.push('/loads');
    } catch (error) {
      console.error('Error adding load:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la información. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
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
                <h1 className="text-lg sm:text-xl font-bold">Agregar Carga</h1>
              </div>
              <SettingsSheet />
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>Inicia sesión</CardTitle>
                  <CardDescription>
                    Debes iniciar sesión para agregar información de cargas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                </CardContent>
              </Card>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
              <Button variant="ghost" size="icon" asChild>
                <Link href="/loads">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold">Agregar Carga</h1>
            </div>
            <SettingsSheet />
          </header>

          <main className="flex-1 w-full p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Nueva Información de Carga</CardTitle>
                  <CardDescription>
                    Comparte información útil sobre puntos de carga con otros conductores.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nombre del lugar <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Ej: Cantera El Roble"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">
                        Material a cargar <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="material"
                        name="material"
                        placeholder="Ej: Arena, Grava, Cemento, etc."
                        value={formData.material}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Ej: Carretera N-340, km 245, Almería"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="radioChannel">Canal de radio emisora</Label>
                      <Input
                        id="radioChannel"
                        name="radioChannel"
                        placeholder="Ej: Canal 19"
                        value={formData.radioChannel}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono del encargado</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Ej: +34 600 123 456"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedule">Horario de atención</Label>
                      <Input
                        id="schedule"
                        name="schedule"
                        placeholder="Ej: Lunes a Viernes 8:00 - 18:00"
                        value={formData.schedule}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas adicionales</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Ej: Llevar DNI, Acceso por la entrada trasera, etc."
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? (
                          <>
                            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Package className="mr-2 h-4 w-4" />
                            Guardar Información
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/loads')}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
