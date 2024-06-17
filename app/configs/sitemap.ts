export const configSitemapGroups: ConfigSitemapGroup[] = [
  {
    title: "Pages",
    items: [{ name: "Landing", to: "/" }],
  },
  {
    title: "Account",
    items: [
      { name: "Sign Up", to: "/signup" },
      { name: "Log In", to: "/login" },
      { name: "Log Out", to: "/logout" },
      { name: "Home", to: "/home" },
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
