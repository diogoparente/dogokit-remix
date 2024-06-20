import { cn } from "~/utils/cn"

export function SectionOr({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("relative flex h-full flex-col py-12", className)}>
      <hr className="h-0 border" />
      <div className="-mt-2 text-center text-xs">
        <span className="rounded-md border bg-background p-2 text-text shadow-sm">OR</span>
      </div>
    </section>
  )
}
