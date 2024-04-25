export type NavItem = {
  isEnabled?: boolean
  path: string
  text: string
  icon: string
  end?: boolean
  shortcut?: string
}

const userNavigationsItems = [
  {
    isEnabled: true,
    path: "/users",
    text: "Users",
    icon: "users-four",
  },
  {
    path: "/user/dashboard",
    text: "Dashboard",
    icon: "binoculars",
    shortcut: "⌘K+D",
  },
  {
    path: "/user/settings",
    text: "Settings",
    icon: "gear",
    shortcut: "⌘K+S",
  },
  {
    path: "/user/account",
    text: "Account",
    icon: "user",
  },
]

const adminNavigationItems = [
  {
    path: "/admin",
    text: "Admin",
    icon: "crown-simple",
  },
  {
    path: "/admin/dashboard",
    text: "Admin Dashboard",
    icon: "crown-simple",
  },
  {
    path: "/admin/pages",
    text: "Pages",
    icon: "rectangle",
  },
  {
    path: "/admin/users",
    text: "Users",
    icon: "users-four",
  },
  {
    path: "/admin/posts",
    text: "Posts",
    icon: "scroll",
  },
  {
    path: "/admin/settings",
    text: "Settings",
    icon: "gear",
  },
  {
    path: "/admin/notifications",
    text: "Notifications",
    icon: "notification",
  },
]

const ownerNavigationItems = [
  {
    path: "/owner/dashboard",
    text: "Owner Dashboard",
    icon: "crown",
  },
  {
    path: "/owner/users",
    text: "Users",
    icon: "users-four",
  },
]

export const configNavigationItems: NavItem[] = [
  {
    isEnabled: false,
    path: "/",
    text: "Home",
    icon: "house",
  },
  {
    isEnabled: true,
    path: "/about",
    text: "About",
    icon: "info",
  },
  {
    isEnabled: true,
    path: "/search",
    text: "Search",
    icon: "magnifying-glass",
  },
  {
    isEnabled: true,
    path: "/posts",
    text: "Posts",
    icon: "scroll",
  },
  ...userNavigationsItems,
  ...adminNavigationItems,
  ...ownerNavigationItems,
  {
    path: "/help",
    text: "Help",
    icon: "question",
    shortcut: "⌘K+H",
  },
  {
    path: "/help/shortcuts",
    text: "Command Palette",
    icon: "keyboard",
    shortcut: "⌘K",
  },
  {
    path: "/user",
    text: "User",
    icon: "user",
  },
  {
    path: "/owner",
    text: "Owner",
    icon: "crown",
  },
  {
    path: "/blank",
    text: "Blank",
    icon: "square",
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
  },
  {
    path: "/logout",
    text: "Log Out",
    icon: "sign-out",
  },
]
