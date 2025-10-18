"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarVariants = cva(
  "fixed top-0 left-0 h-full w-64 border-r border-background transition-transform duration-300 ease-in-out z-40 md:relative md:z-auto",
  {
    variants: {
      variant: {
        default: "",
        collapsible: "w-16",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  asChild?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={cn(sidebarVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

const sidebarHeaderVariants = cva("flex flex-col gap-2 p-4")

interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarHeaderVariants> {
  asChild?: boolean
}

const SidebarHeader = React.forwardRef
  HTMLDivElement,
  SidebarHeaderProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarHeaderVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const sidebarContentVariants = cva("flex flex-col gap-2 p-4 overflow-y-auto flex-1")

interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarContentVariants> {
  asChild?: boolean
}

const SidebarContent = React.forwardRef
  HTMLDivElement,
  SidebarContentProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarContentVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const sidebarFooterVariants = cva("mt-auto flex flex-col gap-2 p-4")

interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarFooterVariants> {
  asChild?: boolean
}

const SidebarFooter = React.forwardRef
  HTMLDivElement,
  SidebarFooterProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarFooterVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const sidebarMenuVariants = cva("flex flex-col gap-2 p-2")

interface SidebarMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarMenuVariants> {
  asChild?: boolean
}

const SidebarMenu = React.forwardRef
  HTMLDivElement,
  SidebarMenuProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarMenuVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const sidebarMenuItemVariants = cva("flex flex-col gap-2")

interface SidebarMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarMenuItemVariants> {
  asChild?: boolean
}

const SidebarMenuItem = React.forwardRef
  HTMLDivElement,
  SidebarMenuItemProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarMenuItemVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground justify-start",
  {
    variants: {
      variant: {
        default: "",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarMenuButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'variant'>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Button
    return (
      <Comp
        className={cn(sidebarMenuButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const sidebarMenuSubVariants = cva("flex flex-col gap-2 p-2")

interface SidebarMenuSubProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarMenuSubVariants> {
  asChild?: boolean
}

const SidebarMenuSub = React.forwardRef
  HTMLDivElement,
  SidebarMenuSubProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarMenuSubVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"

const sidebarMenuSubItemVariants = cva("flex flex-col gap-2")

interface SidebarMenuSubItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarMenuSubItemVariants> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuSubItem = React.forwardRef
  HTMLDivElement,
  SidebarMenuSubItemProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarMenuSubItemVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const sidebarMenuSubButtonVariants = cva(
  "flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground justify-start",
  {
    variants: {
      variant: {
        default: "",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarMenuSubButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'variant'>,
    VariantProps<typeof sidebarMenuSubButtonVariants> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Button
    return (
      <Comp
        className={cn(sidebarMenuSubButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

const sidebarSeparatorVariants = cva("shrink-0 border-t transition-colors")

interface SidebarSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarSeparatorVariants> {
  asChild?: boolean
}

const SidebarSeparator = React.forwardRef
  HTMLDivElement,
  SidebarSeparatorProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(sidebarSeparatorVariants({ className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full h-screen">{children}</div>
}

const SidebarInset = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 overflow-hidden">{children}</div>
}

interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const SidebarTrigger = ({ children, className, ...props }: SidebarTriggerProps) => {
  return (
    <Button
      variant="ghost"
      className={cn("relative z-50", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
}
