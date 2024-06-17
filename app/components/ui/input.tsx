import * as React from "react"

import { cn } from "~/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm",
        "placeholder:text-primary-foreground/50 disabled:cursor-not-allowed disabled:opacity-50",
        "autofill:shadow-fill-background autofill:text-fill-foreground",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-gray-400 dark:placeholder:text-gray-600",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
