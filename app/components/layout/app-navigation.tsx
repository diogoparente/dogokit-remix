import { TooltipArrow, TooltipPortal } from "@radix-ui/react-tooltip"
import { Link, NavLink } from "@remix-run/react"

import { IndicatorUser } from "~/components/shared/indicator-user"
import { Logo } from "~/components/shared/logo"
import { ThemeButton } from "~/components/shared/theme-button"
import { sideNavNavigationItems } from "~/configs/navigation"
import { configSite } from "~/configs/site"
import { useAppRole } from "~/hooks/use-app-role"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { type UserSession } from "~/services/auth.server"
import { cn } from "~/utils/cn"

import { IconMatch } from "../libs/icon"
import { ButtonLink } from "../ui/button-link"
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

  return (
    <nav className="absolute z-[9999] w-screen border-0 border-t bg-background md:relative md:min-h-full md:w-16 md:border-r">
      <div className="flex items-center justify-around gap-4 p-2 pt-4 md:flex-col">
        {sideNavNavigationItems
          .filter(item => {
            if (item.role === "ADMIN" && !isAdmin) {
              return false
            }
            if (item.role === "MANAGER" && !isManager) {
              return false
            }
            return true
          })
          .map(item => (
            <TooltipProvider key={item.path} skipDelayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild disabled={!!item?.isReleased}>
                  {item?.isReleased ? (
                    <NavLink
                      className={cn(
                        appNavLinkClassNames,
                        "flex-1/5 hover:scale-110 hover:bg-secondary hover:text-background",
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
                        "pointer-events-none h-10 min-w-10 bg-gray-200 text-black opacity-20",
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
          ))}
      </div>
    </nav>
  )
}
