import { Link } from "@remix-run/react"

import { Logo } from "~/components/shared/logo"
import { configSite } from "~/configs/site"
// import { configSitemapGroups } from "~/configs/sitemap"
import { cn } from "~/utils/cn"
import { getCurrentYear } from "~/utils/datetime"

export function SiteFooter() {
  return (
    <footer className="space-y-4 p-4">
      <section className="flex flex-wrap items-center justify-center gap-4">
        <div
          className={cn("flex-auto space-y-8 rounded-md bg-primary p-4 text-primary-foreground")}
        >
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/"
              prefetch="intent"
              className=" inline-block rounded-xs transition hover:opacity-75"
            >
              <Logo text="stealth" />
            </Link>
            <p className="max-w-sm text-sm font-semibold">{configSite.description}</p>

            <p className="text-xs">
              <span>&copy; {getCurrentYear()} </span>
              <span>{configSite.name}</span>
              <span>. All rights reserved.</span>
            </p>
          </div>
        </div>
      </section>
    </footer>
  )
}
