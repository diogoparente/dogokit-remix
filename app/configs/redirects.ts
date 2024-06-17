import { type ConfigRedirect } from "~/utils/redirect-route.server"

export const configRedirects: ConfigRedirect[] = [
  { path: "/account", to: "/account" },
  { path: "/auth", to: "/login" },
  { path: "/dev", url: "https://github.com/dogokit/dogokit-remix" },
  { path: "/gh", to: "/github" },
  { path: "/github", url: "https://github.com/dogokit/dogokit-remix" },
  { path: "/links", to: "/redirects" },
  { path: "/register", to: "/signup" },
  { path: "/settings", to: "/settings" },
  { path: "/signin", to: "/login" },
  { path: "/signout", to: "/logout" },
  { path: "/twitter", url: "https://twitter.com/mhaidarhanif" },
  { path: "/u", to: "/user" },
  { path: "/x", to: "/twitter" },
  { path: "/youtube", url: "https://youtube.com/mhaidarhanif" },
  { path: "/yt", to: "/youtube" },
]
