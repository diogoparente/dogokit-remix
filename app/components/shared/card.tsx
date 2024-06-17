import { type PropsWithChildren } from "react"

import { cn } from "~/utils/cn"

import { IconMatch } from "../libs/icon"

const Card = ({
  children,
  className,
  icon,
  label,
}: PropsWithChildren<React.HTMLAttributes<HTMLElement> & { icon?: string; label?: string }>) => (
  <div className={cn("site-card", className)}>
    {label ? (
      <h2 className="inline-flex items-center gap-2 pb-2">
        {icon ? <IconMatch icon={icon} /> : null}
        <span>{label}</span>
      </h2>
    ) : null}
    {children}
  </div>
)

export { Card }
