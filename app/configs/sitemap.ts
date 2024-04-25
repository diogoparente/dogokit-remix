export const configSitemapGroups: ConfigSitemapGroup[] = [
  {
    title: "Pages",
    items: [
      { name: "Landing", to: "/" },
      { name: "About", to: "/about" },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Sign Up", to: "/signup" },
      { name: "Log In", to: "/login" },
      { name: "Log Out", to: "/logout" },
      { name: "Dashboard", to: "/user/dashboard" },
    ],
  },

  {
    title: "Links",
    items: [],
  },
]

type ConfigSitemapGroup = {
  title?: string
  items: {
    name: string
    url?: string
    to?: string
  }[]
}
