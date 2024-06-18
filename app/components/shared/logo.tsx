import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "~/utils/cn"

import logoDark from "../../../public/images/logos/logo-dark.png"
import logoLight from "../../../public/images/logos/logo-light.png"
import { useTheme } from "./theme"

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
  const [theme] = useTheme()
  return (
    <span
      className={cn(logoVariants({ variant, size, className }), "duration-200 hover:scale-110")}
    >
      {/* <img src={theme === "dark" ? logoDark : logoLight} alt="logo" className="size-8" /> */}
      <span className="inline-flex flex-nowrap font-display text-text">{text}</span>
    </span>
  )
}
