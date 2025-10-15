'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

const SIDEBAR_COOKIE_NAME = 'sidebar:state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const sidebarContext = React.createContext<{
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function useSidebar() {
  const context = React.useContext(sidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }

  return context
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SidebarProvider = React.forwardRef
  HTMLDivElement,
  SidebarProviderProps
>(({ defaultOpen = true, open: openProp, onOpenChange, className, style, children, ...props }, ref) => {
  const [_open, _setOpen] = React.useState(openProp ?? defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const newOpen = typeof value === 'function' ? value(open) : value
      _setOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [open, onOpenChange]
  )

  return (
    <sidebarContext.Provider value={{ state: open ? 'expanded' : 'collapsed', open, setOpen }}>
      <div
        ref={ref}
        className={cn('flex h-screen w-full overflow-hidden bg-background', className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </sidebarContext.Provider>
  )
})
SidebarProvider.displayName = 'SidebarProvider'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

const Sidebar = React.forwardRef
  HTMLDivElement,
  SidebarProps
>(({ side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-64 flex-col border-r bg-background',
        side === 'right' && 'border-r-0 border-l',
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = 'Sidebar'

const SidebarHeader = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-2 px-4 py-3', className)}
    {...props}
  />
))
SidebarHeader.displayName = 'SidebarHeader'

const SidebarFooter = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-auto flex flex-col gap-2 px-4 py-3', className)}
    {...props}
  />
))
SidebarFooter.displayName = 'SidebarFooter'

const SidebarContent = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-auto', className)}
    {...props}
  />
))
SidebarContent.displayName = 'SidebarContent'

const SidebarSeparator = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('my-2 mx-2 h-px bg-border', className)}
    {...props}
  />
))
SidebarSeparator.displayName = 'SidebarSeparator'

const SidebarMenu = React.forwardRef
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn('flex flex-col gap-1 px-2', className)} {...props} />
))
SidebarMenu.displayName = 'SidebarMenu'

const SidebarMenuItem = React.forwardRef
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(
        'w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = 'SidebarMenuButton'

const SidebarMenuSub = React.forwardRef
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('ml-4 flex flex-col gap-1 border-l border-muted px-3 py-2', className)}
    {...props}
  />
))
SidebarMenuSub.displayName = 'SidebarMenuSub'

const SidebarMenuSubItem = React.forwardRef
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuSubButton = React.forwardRef
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(({ className, isActive, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(
        'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

const SidebarInset = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative flex flex-1 flex-col overflow-hidden', className)}
    {...props}
  />
))
SidebarInset.displayName = 'SidebarInset'

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const SidebarTrigger = React.forwardRef
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, onClick, asChild = false, ...props }, ref) => {
  const { open, setOpen } = useSidebar()
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        setOpen(!open)
      }}
      className={cn('rounded-md p-2 hover:bg-accent', className)}
      {...props}
    />
  )
})
SidebarTrigger.displayName = 'SidebarTrigger'

export {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
}
