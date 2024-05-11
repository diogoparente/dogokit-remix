import { SiteFooter } from "~/components/layout/site-footer"
import { SiteNavigation } from "~/components/layout/site-navigation"
import { cn } from "~/utils/cn"

export function SiteLayout({ className, children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavigation />

      <main className={cn("flex flex-1 grow", className)}>{children}</main>

      <SiteFooter />
    </div>
  )
}
