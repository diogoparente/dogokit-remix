import { Link } from "@remix-run/react"

import { Logo } from "~/components/shared/logo"
import { configSite } from "~/configs/site"
// import { configSitemapGroups } from "~/configs/sitemap"
import { cn } from "~/utils/cn"
import { getCurrentYear } from "~/utils/datetime"

export function SiteFooter() {
  return (
    <footer className="mt-40 space-y-4 p-4">
      <SiteFooterSitemap />
      {/* <SiteFooterExtra /> */}
    </footer>
  )
}

function SiteFooterSitemap() {
  return (
    <section className="flex flex-wrap items-center justify-center gap-4">
      <div className={cn("flex-auto space-y-8 rounded-md bg-muted/30 p-4")}>
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/"
            prefetch="intent"
            className="focus-ring inline-block rounded-xs transition hover:opacity-75"
          >
            <Logo text="squadz" classNameIcon="grayscale" />
          </Link>
          <p className="max-w-sm text-sm">{configSite.description}</p>

          <p className="text-xs">
            <span>&copy; {getCurrentYear()} </span>
            <span>{configSite.name}</span>
            <span>. All rights reserved.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

// function AnchorFooter({ href, children }: AnchorProps) {
//   return (
//     <Anchor href={href} className="focus-ring font-semibold">
//       {children}
//     </Anchor>
//   )
// }

/**
 * Can either using flexbox or grid
 */
// function FooterSitemap() {
//   return (
//     <ul className="flex flex-wrap gap-8">
//       {configSitemapGroups.map(group => (
//         <li key={group.title} className="min-w-[140px] space-y-4">
//           <h3 className="text-lg">{group.title}</h3>

//           <ul className="space-y-3 text-sm">
//             {group.items.map(item => (
//               <li key={item.to || item.url}>
//                 {item.url && (
//                   <Anchor
//                     href={item.url}
//                     className="focus-ring text-muted-foreground transition hover:text-foreground"
//                   >
//                     {item.name}
//                   </Anchor>
//                 )}
//                 {item.to && (
//                   <Link
//                     to={item.to}
//                     prefetch="intent"
//                     className="focus-ring text-muted-foreground transition hover:text-foreground"
//                   >
//                     {item.name}
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </li>
//       ))}
//     </ul>
//   )
// }
