export type NavItem = {
  isAlwaysVisible?: boolean
  path: string
  text: string
  icon?: string
  end?: boolean
  isReleased?: boolean
  role?: "USER" | "MANAGER" | "ADMIN"
}

const userNavigationsItems = [
  {
    path: "/home",
    text: "Home",
    icon: "house",
  },
  {
    path: "/settings",
    text: "Settings",
    icon: "gear",
  },
  {
    path: "/account",
    text: "Account",
    icon: "user",
  },
]

export const configNavigationItems: NavItem[] = [
  ...userNavigationsItems,

  {
    path: "/user",
    text: "User",
    icon: "user",
  },
  {
    path: "/signup",
    text: "Log In",
    icon: "user-plus",
  },
  {
    path: "/login",
    text: "Log In",
    icon: "sign-in",
    isAlwaysVisible: true,
  },
  {
    path: "/logout",
    text: "Log Out",
    icon: "sign-out",
    isAlwaysVisible: true,
  },
]

export const sideNavNavigationItems: NavItem[] = [
  userNavigationsItems[0]!,
  {
    path: "/company",
    text: "Company",
    icon: "tree-structure",
    isReleased: true,
  },
  {
    path: "/time-off",
    text: "Time off",
    icon: "calendar-plus",
  },
  {
    path: "/job-listings",
    text: "Job listings",
    icon: "add-user",
    role: "MANAGER",
    isReleased: true,
  },
  {
    path: "/company/settings",
    text: "Company settings",
    icon: "gear",
    role: "ADMIN",
    isReleased: true,
  },
]
