'use client'

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { createContext } from 'use-context-selector'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { PanelLeft, MapPin, Phone, Radio, Clock, Package, Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SettingsSheet } from '@/app/components/settings-sheet'

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface SidebarContextValue {
  isOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  isOpen: true,
  toggleSidebar: () => {},
})

const sidebarMenuButtonVariants = cva(
  'flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors w-full hover:bg-accent hover:text-accent-foreground',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export function SidebarProvider({
  children,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const isControlled = controlledOpen !== undefined
  const isOpenValue = isControlled ? controlledOpen : isOpen

  const toggleSidebar = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(!controlledOpen)
    } else {
      setIsOpen((prev) => !prev)
    }
  }, [isControlled, controlledOpen, onOpenChange])

  const contextValue = useMemo(
    () => ({
      isOpen: isOpenValue,
      toggleSidebar,
    }),
    [isOpenValue, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="flex min-h-dvh">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen } = React.useContext(SidebarContext)
  return (
    <>
      <nav
        className={`fixed inset-y-0 left-0 z-30 w-64 border-r bg-background p-4 transition-transform duration-300 ease-in-out sm:static sm:transition-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        {children}
      </nav>
      <div
        className={`fixed inset-0 z-20 bg-black/50 sm:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={React.useContext(SidebarContext).toggleSidebar}
      />
    </>
  )
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  const { isOpen } = React.useContext(SidebarContext)
  return (
    <div
      className={`flex-1 transition-all duration-300 ease-in-out sm:ml-0 ${
        isOpen ? 'ml-0 sm:ml-64' : 'ml-0'
      }`}
    >
      {children}
    </div>
  )
}

export function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = React.useContext(SidebarContext)
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 p-4">{children}</div>
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>
}

export function SidebarMenuButton({
  asChild,
  className,
  isActive,
  ...props
}: {
  asChild?: boolean
  className?: string
  isActive?: boolean
} & React.ComponentProps<typeof Button>) {
  const Comp = asChild ? Slot : Button
  return (
    <Comp
      variant="ghost"
      className={sidebarMenuButtonVariants({ active: isActive, className })}
      {...props}
    />
  )
}

export function SidebarSearch() {
  return (
    <div className="p-2">
      <Input placeholder="Buscar..." className="w-full" />
    </div>
  )
}

export function SidebarSettings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full justify-start">
                <SettingsSheet />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent side="right">
        <SettingsSheet />
      </SheetContent>
    </Sheet>
  )
}

export function SidebarMenuDemo() {
  const pathname = '/loads' // Simulación de usePathname
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === '/loads'}>
          <Link href="/loads">
            <Package className="h-4 w-4" />
            <span>Cargas</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === '/loads/add'}>
          <Link href="/loads/add">
            <Plus className="h-4 w-4" />
            <span>Agregar Carga</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
