import { AppNavigation, SidenavAppNavigation } from "~/components/layout/app-navigation"
import { cn } from "~/utils/cn"

export function AppLayout({ className, children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <AppNavigation />
      <main
        className={cn(
          "flex h-screen flex-1 flex-col-reverse overflow-y-hidden md:flex-row",
          className,
        )}
      >
        <SidenavAppNavigation />
        <div className="flex flex-1 pt-1">
          <div className="mx-2 max-h-[calc(100vh-49px)] w-full overflow-y-auto">{children}</div>
        </div>
      </main>
    </div>
  )
}
