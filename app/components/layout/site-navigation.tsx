import { Link, NavLink, type NavLinkProps } from "@remix-run/react"

import { SiteNavigationMenu } from "~/components/layout/site-navigation-menu"
import { IconMatch } from "~/components/libs/icon"
import { IndicatorUser } from "~/components/shared/indicator-user"
import { Logo } from "~/components/shared/logo"
import { ThemeButton } from "~/components/shared/theme-button"
import { ButtonLink } from "~/components/ui/button-link"
import { configNavigationItems, type NavItem } from "~/configs/navigation"
import { configSite } from "~/configs/site"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { cn } from "~/utils/cn"

import { LoggedUserControls, NotLoggedUserControls } from "./app-navigation"

export function SiteNavigation() {
  return (
    <>
      <SiteNavigationSmall />
      <SiteNavigationLarge />
    </>
  )
}

const allowRestrictedRoutes = false

function SiteNavigationSmall() {
  const { userSession } = useRootLoaderData()

  return (
    <nav
      className={cn(
        "sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-b-border bg-background p-2 transition-colors lg:hidden",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Link to={userSession ? "/home" : "/"} prefetch="intent" className=" block transition">
          <Logo text={configSite.name} />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {userSession &&
          (allowRestrictedRoutes ? (
            <>
              <SiteNavigationMenu />

              <ButtonLink to="/new" prefetch="intent" size="sm" className="hidden sm:inline-flex">
                <IconMatch icon="plus" />
                <span className="hidden sm:inline">New</span>
              </ButtonLink>

              <IndicatorUser size="sm" allowRestrictedRoutes={allowRestrictedRoutes} />
            </>
          ) : (
            <IndicatorUser size="sm" allowRestrictedRoutes={allowRestrictedRoutes} />
          ))}

        {!userSession && (
          <>
            <ButtonLink to="/login" prefetch="intent" size="sm">
              <IconMatch icon="sign-in" />
              <span className="hidden sm:inline">Log In</span>
            </ButtonLink>

            <SiteNavigationMenu />
          </>
        )}
        <ThemeButton size="sm" />
      </div>
    </nav>
  )
}

function SiteNavigationLarge() {
  const { userSession } = useRootLoaderData()

  return (
    <nav
      className={cn(
        "pointer-events-auto sticky top-0 z-50 hidden items-center justify-between gap-2 border-b border-b-border bg-background p-2 lg:flex",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Link to={userSession ? "/home" : "/"} prefetch="intent" className=" block transition">
          <Logo text={configSite.name} />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ul className="flex items-center gap-4">
          {configNavigationItems
            .filter(item => configSite.navItems.includes(item.path))
            .map(navItem => (
              <NavItemLink key={navItem.path} navItem={navItem} />
            ))}
        </ul>

        <div className="flex items-center gap-4">
          <NotLoggedUserControls userSession={userSession} />
          <LoggedUserControls userSession={userSession} />
        </div>
      </div>
    </nav>
  )
}

export function NavItemLink({
  navItem,
  onClick,
}: { navItem: NavItem } & Pick<NavLinkProps, "onClick">) {
  return (
    <li>
      <NavLink
        to={navItem.path}
        prefetch="intent"
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            "inline-flex select-none items-center gap-2 rounded-md px-2 py-1 font-semibold transition hover:scale-110 hover:bg-opacity-80",
            isActive && "text-secondary",
          )
        }
      >
        {navItem.icon ? <IconMatch icon={navItem.icon} /> : null}
        <span className="select-none">{navItem.text}</span>
      </NavLink>
    </li>
  )
}
