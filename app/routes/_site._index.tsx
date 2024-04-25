import { type MetaFunction } from "@remix-run/node"

import { configSite } from "~/configs/site"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap("/", 1)

export const meta: MetaFunction = () =>
  createMeta({
    title: configSite.name,
    description: configSite.description,
  })

export default function IndexRoute() {
  return (
    <div className="site-container space-y-12">
      <section className="site-section">
        <h1>{configSite.ipsum.short}</h1>
      </section>
    </div>
  )
}
