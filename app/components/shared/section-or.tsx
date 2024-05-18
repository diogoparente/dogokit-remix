import { cn } from "~/utils/cn"

export function SectionOr({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("flex flex-col", className)}>
      <hr className="h-0 border-t border-secondary" />
      <div className="-mt-2 text-center text-xs">
        <span className="m-2 rounded-md border border-secondary bg-background p-2 text-text shadow-sm">
          OR
        </span>
      </div>
    </section>
  )
}
