import { cn } from "~/utils/cn"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-tertiary animate-pulse rounded-md", className)} {...props} />
}

export { Skeleton }
