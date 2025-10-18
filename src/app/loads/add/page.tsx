'use client';

import React, { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { SettingsSheet } from '@/app/components/settings-sheet';
import { MainSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { useFirebase } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function AddLoadContent() {
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
      <div className="flex-1 flex flex-col bg-background text-foreground">
        <header className="w-full p-4 sm:p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">Agregar Carga</h1>
          </div>
          <SettingsSheet />
        </header>
        <main className="flex-1 flex items-center justify-center
