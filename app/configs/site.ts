/**
 * EDITME: Site Config
 *
 * Site-wide information
 */

import { isDevelopment as isDevelopmentClient } from "~/utils/env.client"
import { isDevelopment as isDevelopmentServer } from "~/utils/env.server"

const isDevelopment = typeof window === "undefined" ? isDevelopmentServer : isDevelopmentClient

// For general purpose
export const configSite = {
  domain: "squadz.io",

  // Recommended: 60 characters
  name: "stealth", // Can be different with title
  title: "stealth", // Can be different with name
  slug: "stealth",

  // Recommended: 155-160 characters
  description: "Everyone, one place",

  ipsum: {
    short: "Lorem ipsum dolor sit amet",
    medium:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam vestibulum morbi blandit cursus risus at ultrices mi. Eget dolor morbi non arcu risus. Molestie nunc non blandit massa enim nec dui nunc. Diam sollicitudin tempor id eu nisl. Arcu non sodales neque sodales ut. Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat.",
  },

  languageCode: "en",
  countryCode: "US",

  logos: {
    dark: "/images/logos/svg/dogokit-white.svg",
    light: "/images/logos/svg/dogokit-black.svg",
  },

  links: {},

  twitter: {
    site: "@mhaidarhanif",
    creator: "@mhaidarhanif",
  },

  author: {
    name: "M Haidar Hanif",
    handle: "@mhaidarhanif",
    url: "https://mhaidarhanif.com",
  },

  company: {
    name: "stealth",
    handle: "@stealth",
    url: isDevelopment ? "http://localhost:3000/" : "https://squadz.io",
    canonicalUrl: isDevelopment ? "http://localhost:3000/" : "https://squadz.io/",
  },

  // Setup all the available paths in app/configs/navigation.ts
  navItems: ["/", "/about"],
}

// The order matters on what being shown first
export const configSiteIconLinks = [
  { name: "GitHub", href: "https://github.com/dogokit/dogokit-remix" },
  { name: "Twitter", href: "https://twitter.com/mhaidarhanif" },
  { name: "X-Twitter", href: "https://x.com/mhaidarhanif" },
  { name: "LinkedIn", href: "https://linkedin.com/in/mhaidarhanif" },
  { name: "YouTube", href: "https://youtube.com/mhaidarhanif" },
  { name: "Facebook", href: "https://facebook.com/mhaidarhanif" },
  { name: "Instagram", href: "https://instagram.com/mhaidarhanif_" },
  { name: "Threads", href: "https://threads.net/mhaidarhanif_" },
  { name: "Telegram", href: "https://t.me/mhaidarhanif" },
]
