import { type MetaFunction } from "@remix-run/node"

import { Home } from "~/components/route-wrappers/home"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export const meta: MetaFunction = () => createMeta({ title: `Home`, description: `Latest news` })

export default function HomeRoute() {
  return <Home />
}
