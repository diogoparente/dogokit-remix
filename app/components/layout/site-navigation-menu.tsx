import { NavLink, useNavigate, type NavLinkProps } from "@remix-run/react"
import { useState } from "react"

import { NavItemLink } from "~/components/layout/site-navigation"
import { IconMatch } from "~/components/libs/icon"
import { IndicatorUser } from "~/components/shared/indicator-user"
import { Logo } from "~/components/shared/logo"
import { Button } from "~/components/ui/button"
import { ButtonLink } from "~/components/ui/button-link"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "~/components/ui/sheet"
import { configNavigationItems, type NavItem } from "~/configs/navigation"
import { configSite } from "~/configs/site"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { cn } from "~/utils/cn"

export function SiteNavigationMenu() {
  const { userSession } = useRootLoaderData()

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <IconMatch icon="list" />
          <span>Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col justify-between">
        <div className="mb-10 space-y-6">
          <SheetHeader className="-mt-2 flex items-center gap-2">
            <NavLinkMenu
              to="/"
              onOpenChange={setOpen}
              className="prose-a-styles rounded-xs transition"
            >
              <Logo text="stealth" className="p-2" />
            </NavLinkMenu>
          </SheetHeader>

          <div className="flex items-center justify-end gap-4">
            {!userSession && (
              <>
                <ButtonLink
                  to="/login"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigate("/login")
                    setOpen?.(false)
                  }}
                >
                  <IconMatch icon="sign-in" />
                  <span>Log In</span>
                </ButtonLink>
                <ButtonLink
                  to="/signup"
                  size="sm"
                  onClick={() => {
                    navigate("/signup")
                    setOpen?.(false)
                  }}
                >
                  <IconMatch icon="user-plus" />
                  <span>Sign Up</span>
                </ButtonLink>
              </>
            )}

            {userSession && <IndicatorUser size="sm" allowRestrictedRoutes={false} />}
          </div>

          <ul className="flex flex-col items-end gap-4">
            {configNavigationItems
              .filter(item => configSite.navItems.includes(item.path))
              .map(navItem => (
                <NavItemLinkMenu key={navItem.path} onOpenChange={setOpen} navItem={navItem} />
              ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/**
 * NavLinkMenu and NavItemLinkMenu are part of the Sheet component
 * so when the NavLink is navigated, the Sheet is closed
 *
 * NavItemLinkMenu is related to NavItemLink as it has some styles
 */

function NavLinkMenu({
  to,
  onOpenChange,
  className,
  children,
}: {
  onOpenChange: (open: boolean) => void
} & NavLinkProps) {
  const navigate = useNavigate()

  return (
    <NavLink
      to={to}
      onClick={() => {
        navigate(to.toString())
        onOpenChange?.(false)
      }}
      className={cn(" !text-foreground", className)}
    >
      {children}
    </NavLink>
  )
}

function NavItemLinkMenu({
  onOpenChange,
  navItem,
}: {
  onOpenChange: (open: boolean) => void
  navItem: NavItem
}) {
  const navigate = useNavigate()

  return (
    <NavItemLink
      navItem={navItem}
      onClick={() => {
        navigate(navItem.path.toString())
        onOpenChange?.(false)
      }}
    />
  )
}
