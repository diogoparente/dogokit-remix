import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "~/utils/cn"

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center rounded-md text-sm font-semibold ring-offset-background duration-700 hover:scale-105 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border bg-background hover:border-primary",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 gap-1 rounded-sm px-2 text-xs",
        sm: "h-8 gap-2 rounded-md px-3",
        default: "h-10 gap-2 px-4 py-2",
        lg: "h-12 gap-3 rounded-md px-6 text-lg",
        xl: "h-14 gap-4 rounded-md px-8 text-xl",
      },
      isIcon: { true: "p-0", false: "" },
      isIconText: { true: "flex items-center gap-2", false: "" },
    },
    compoundVariants: [
      { isIcon: true, size: "xs", class: "size-6 text-lg" },
      { isIcon: true, size: "sm", class: "size-8 text-xl" },
      { isIcon: true, size: "default", class: "size-10 text-2xl" },
      { isIcon: true, size: "lg", class: "size-12 text-4xl" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      isLoading,
      variant,
      size,
      isIcon,
      isIconText,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, isIcon, isIconText, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? "Loading" : children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
