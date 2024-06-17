import { type PropsWithChildren } from "react"

import { cn } from "~/utils/cn"

const SubTitle = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <h3 className={cn("w-fit font-display text-secondary", className)}>{children}</h3>
)

export { SubTitle }
