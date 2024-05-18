import { Link } from "@remix-run/react"

import { IconMatch } from "~/components/libs/icon"
import { IndicatorUser } from "~/components/shared/indicator-user"
import { Logo } from "~/components/shared/logo"
import { ThemeButton } from "~/components/shared/theme-button"
import { ButtonLink } from "~/components/ui/button-link"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { type UserSession } from "~/services/auth.server"
import { cn } from "~/utils/cn"

const UserControls = ({
  userSession,
  allowRestrictedRoutes,
}: {
  userSession?: UserSession
  allowRestrictedRoutes: boolean
}) => {
  if (userSession) {
    return allowRestrictedRoutes ? (
      <>
        <ButtonLink to="/new" size="xs">
          <IconMatch icon="plus" />
          <span>New</span>
        </ButtonLink>
        <IndicatorUser size="xs" allowRestrictedRoutes={allowRestrictedRoutes} />
      </>
    ) : (
      <IndicatorUser size="xs" allowRestrictedRoutes={allowRestrictedRoutes} />
    )
  }
  return (
    <>
      <ButtonLink to="/logout" size="xs" variant="destructive">
        Log out
      </ButtonLink>
      <ButtonLink to="/" prefetch="intent" size="xs">
        Home
      </ButtonLink>
    </>
  )
}

export const AppNavigation = () => {
  const { userSession } = useRootLoaderData()
  const allowRestrictedRoutes = false

  return (
    <nav
      className={cn(
        "pointer-events-auto sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-b-border bg-background p-2",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Link to="/" className=" block rounded-xs transition hover:opacity-75">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <UserControls userSession={userSession} allowRestrictedRoutes={allowRestrictedRoutes} />
        <ThemeButton size="xs" />
      </div>
    </nav>
  )
}
