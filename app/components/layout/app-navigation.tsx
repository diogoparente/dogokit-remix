import { TooltipArrow, TooltipPortal } from "@radix-ui/react-tooltip"
import { Link, NavLink } from "@remix-run/react"

import { IndicatorUser } from "~/components/shared/indicator-user"
import { Logo } from "~/components/shared/logo"
import { ThemeButton } from "~/components/shared/theme-button"
import { sideNavNavigationItems, type NavItem } from "~/configs/navigation"
import { configSite } from "~/configs/site"
import { useAppRole } from "~/hooks/use-app-role"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { type UserSession } from "~/services/auth.server"
import { cn } from "~/utils/cn"

import { IconMatch } from "../libs/icon"
import { ButtonLink } from "../ui/button-link"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const appNavLinkClassNames = "flex gap-2 rounded-sm p-2"

export const NotLoggedUserControls = ({ userSession }: { userSession?: UserSession }) => {
  return !userSession ? (
    <>
      <ButtonLink to="/login" prefetch="intent" variant="secondary" size="sm">
        <IconMatch icon="sign-in" />
        <span>Log In</span>
      </ButtonLink>
      <ButtonLink to="/signup" prefetch="intent" size="sm">
        <IconMatch icon="user-plus" />
        <span>Sign Up</span>
      </ButtonLink>
      <ThemeButton />
    </>
  ) : null
}

export const LoggedUserControls = ({ userSession }: { userSession?: UserSession }) => {
  return userSession ? (
    <div className="flex items-center gap-4">
      <IndicatorUser size="sm" allowRestrictedRoutes={true} />
      <ThemeButton />
    </div>
  ) : null
}

export const AppNavigation = () => {
  const { userSession } = useRootLoaderData()

  return (
    <nav
      className={cn(
        "pointer-events-auto sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-b-border bg-background p-2",
      )}
    >
      <div className="ml-2 flex items-center justify-between gap-2">
        <Link to={userSession ? "/home" : "/"} prefetch="intent" className=" block transition">
          <Logo text={configSite.name} />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <NotLoggedUserControls userSession={userSession} />
        <LoggedUserControls userSession={userSession} />
      </div>
    </nav>
  )
}

export const SidenavAppNavigation = () => {
  const { isAdmin, isManager } = useAppRole()

  const userNavigationItems = sideNavNavigationItems.filter(navItem => !navItem?.role)

  const managerNavigationItems = isManager
    ? sideNavNavigationItems.filter(navItem => navItem.role === "MANAGER")
    : []

  const adminNavigationItems = isAdmin
    ? sideNavNavigationItems.filter(navItem => navItem.role === "ADMIN")
    : []

  const showManagerDivider = !!managerNavigationItems.length
  const showAdminDivider = !!adminNavigationItems.length

  const renderNavigationSection = (navItems: NavItem[]) =>
    navItems.map(item => (
      <TooltipProvider key={item.path} skipDelayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild disabled={!!item?.isReleased}>
            {item?.isReleased ? (
              <NavLink
                className={cn(
                  appNavLinkClassNames,
                  "hover:scale-110 hover:bg-secondary hover:text-background",
                )}
                to={item.path}
                prefetch="intent"
              >
                {item?.icon ? <IconMatch icon={item?.icon} className="size-6" /> : null}
              </NavLink>
            ) : (
              <IconMatch
                icon={item.icon!}
                className={cn(
                  appNavLinkClassNames,
                  "pointer-events-none size-10 bg-gray-200 text-black opacity-20",
                )}
              />
            )}
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="right" sideOffset={5}>
              {item.text}
              <TooltipArrow />
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>
    ))

  return (
    <nav className="sticky flex min-h-full min-w-16 flex-col items-center gap-4 border-0 border-r p-2 pt-4">
      {renderNavigationSection(userNavigationItems)}
      {showManagerDivider ? <Separator /> : null}
      {renderNavigationSection(managerNavigationItems)}
      {showAdminDivider ? <Separator /> : null}
      {renderNavigationSection(adminNavigationItems)}
    </nav>
  )
}
