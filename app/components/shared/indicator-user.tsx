import { NavLink } from "@remix-run/react"
import { type VariantProps } from "class-variance-authority"

import { IconMatch } from "~/components/libs/icon"
import { AvatarAuto, type avatarAutoVariants } from "~/components/ui/avatar-auto"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { configNavigationItems, type NavItem } from "~/configs/navigation"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

interface IndicatorUserProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof avatarAutoVariants> {
  align?: "center" | "start" | "end" | undefined
  allowRestrictedRoutes: boolean
}

export function IndicatorUser({ align = "end", allowRestrictedRoutes, size }: IndicatorUserProps) {
  const { userData } = useRootLoaderData()

  if (!userData) return null

  /**
   * Configured as a function to be near with the other navItems
   */
  const profileNavItem = (username: string) => [
    {
      text: "Profile",
      path: `/user/${username}`,
      icon: "user",
    },
  ]

  /**
   * Configure the available paths in app/configs/navigation.ts
   */

  const personalItems = ["/home"]

  const userNavItems = ["/settings", "/notifications"]

  const authNavItems = ["/logout"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" rounded-full">
        <AvatarAuto user={userData} imageUrl={userData.images[0]?.url} size={size} />
      </DropdownMenuTrigger>

      {allowRestrictedRoutes ? (
        <DropdownMenuContent align={align} className="w-56">
          <DropdownMenuGroupItems
            items={[...configNavigationItems.filter(item => personalItems.includes(item.path))]}
          />
          <DropdownMenuGroupItems
            items={[
              ...profileNavItem(userData!.username!),
              ...configNavigationItems.filter(item => userNavItems.includes(item.path)),
            ]}
          />
          <DropdownMenuGroupItems
            items={[...configNavigationItems.filter(item => authNavItems.includes(item.path))]}
          />
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent>
          <DropdownMenuGroupItems
            items={configNavigationItems.filter(item => authNavItems.includes(item.path))}
          />
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

/**
 * More than just navigation items, can be actions as well
 */
function DropdownMenuGroupItems({ items }: { items: NavItem[] }) {
  return (
    <DropdownMenuGroup>
      {items.map(item => {
        const isLogout = item.path === "/logout"
        return (
          <DropdownMenuItem
            key={item.path}
            isDestructive={isLogout}
            disabled={!item.isReleased}
            asChild
          >
            <NavLink to={item.path} prefetch="intent">
              {item?.icon ? <IconMatch icon={item?.icon} className="me-2" /> : null}
              <span>{item.text}</span>
            </NavLink>
          </DropdownMenuItem>
        )
      })}
    </DropdownMenuGroup>
  )
}
