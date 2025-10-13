'use client';

import React, { useState, useEffect } from 'react';
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
import { collection, addDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export default function AddOrEditLoadPage() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const loadId = searchParams.get('id'); // <— si existe, estamos editando
  const isEditing = Boolean(loadId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  const [formData, setFormData] = useState({
    name: '',
    material: '',
    radioChannel: '',
    phone: '',
    schedule: '',
    location: '',
    notes: '',
  });

  // Cargar datos si es edición
  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && firestore && loadId) {
        try {
          const docRef = doc(firestore, 'loads', loadId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data() as any);
          } else {
            toast({
              title: 'No encontrado',
              description: 'No se encontró la carga solicitada.',
              variant: 'destructive',
            });
            router.push('/loads');
          }
        } catch (error) {
          console.error('Error al cargar la carga:', error);
          toast({
            title: 'Error',
            description: 'No se pudo cargar la información.',
            variant: 'destructive',
          });
        } finally {
          setLoadingData(false);
        }
      }
    };
    fetchData();
  }, [isEditing, firestore, loadId, router, toast]);

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
        description: 'Debes iniciar sesión para guardar información.',
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
      if (isEditing && loadId) {
        // Actualizar documento existente
        const docRef = doc(firestore, 'loads', loadId);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        toast({
          title: '✅ Información actualizada',
          description: 'Los datos se han modificado correctamente.',
        });
      } else {
        // Crear nuevo documento
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
      }

      router.push('/loads');
    } catch (error) {
      console.error('Error al guardar la carga:', error);
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
                    Debes iniciar sesión para agregar o editar información de cargas.
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
              <h1 className="text-lg sm:text-xl font-bold">
                {isEditing ? 'Editar Carga' : 'Agregar Carga'}
              </h1>
            </div>
            <SettingsSheet />
          </header>

          <main className="flex-1 w-full p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isEditing ? 'Modificar información de carga' : 'Nueva información de carga'}
                  </CardTitle>
                  <CardDescription>
                    {isEditing
                      ? 'Edita los campos que necesites y guarda los cambios.'
                      : 'Comparte información útil sobre puntos de carga con otros conductores.'}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {loadingData ? (
                    <p className="text-center py-8">Cargando datos...</p>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nombre del lugar <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
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
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="radioChannel">Canal de radio emisora</Label>
                        <Input
                          id="radioChannel"
                          name="radioChannel"
                          value={formData.radioChannel}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono del encargado</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schedule">Horario de atención</Label>
                        <Input
                          id="schedule"
                          name="schedule"
                          value={formData.schedule}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas adicionales</Label>
                        <Textarea
                          id="notes"
                          name="notes"
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
                              {isEditing ? 'Guardar Cambios' : 'Guardar Información'}
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
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
