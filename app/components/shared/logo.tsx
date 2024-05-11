import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "~/utils/cn"

import LogoIcon from "./logo-icon"

const logoVariants = cva("flex items-center gap-1 font-semibold", {
  variants: {
    variant: {
      default: "",
      link: "",
    },
    size: {
      default: "text-xl sm:text-2xl",
      lg: "gap-2 text-2xl sm:text-3xl",
      xl: "gap-2 text-3xl sm:text-4xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface LogoProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof logoVariants> {
  text?: string
  classNameIcon?: string
}

export function Logo({ variant, size, className, text }: LogoProps) {
  return (
    <span
      className={cn(logoVariants({ variant, size, className }), "duration-200 hover:scale-110")}
    >
      <LogoIcon />
      <span className="inline-flex flex-nowrap font-display">{text}</span>
    </span>
  )
}
