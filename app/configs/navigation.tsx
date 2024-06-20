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
    isReleased: true,
  },
  {
    path: "/account",
    text: "Account",
    icon: "user",
  },
  {
    path: "/settings",
    text: "Settings",
    icon: "gear",
  },
]

export const configNavigationItems: NavItem[] = [
  ...userNavigationsItems,

  {
    path: "/user",
    text: "User",
    icon: "user",
    isReleased: true,
  },
  {
    path: "/signup",
    text: "Signup",
    icon: "user-plus",
    isReleased: true,
  },
  {
    path: "/login",
    text: "Log In",
    icon: "sign-in",
    isReleased: true,
    isAlwaysVisible: true,
  },
  {
    path: "/logout",
    text: "Log Out",
    icon: "sign-out",
    isReleased: true,
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
    path: "/job-listings",
    text: "Job listings",
    icon: "add-user",
    role: "MANAGER",
    isReleased: true,
  },
  {
    path: "/time-off",
    text: "Time off",
    icon: "calendar-plus",
  },
  userNavigationsItems[1]!,
  userNavigationsItems[2]!,
]
