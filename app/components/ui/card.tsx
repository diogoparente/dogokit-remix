import { type PropsWithChildren } from "react"

import { cn } from "~/utils/cn"

const Card = ({
  children,
  className,
  isHoverable,
}: PropsWithChildren<React.HTMLAttributes<HTMLElement> & { isHoverable?: boolean }>) => (
  <div
    className={cn(
      "rounded-md p-4 shadow-md shadow-border",
      isHoverable ? "duration-700 hover:scale-105 hover:shadow-lg hover:shadow-gray-400" : "",
      className,
    )}
  >
    {children}
  </div>
)

export { Card }
