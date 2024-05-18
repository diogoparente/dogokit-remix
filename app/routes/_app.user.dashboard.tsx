import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { AvatarAuto } from "~/components/ui/avatar-auto"
import { requireUser } from "~/helpers/auth"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export const meta: MetaFunction = () =>
  createMeta({
    title: `User Dashboard`,
    description: `Dashboard for personal user`,
  })

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await requireUser(request)

  return json({ user })
}

export default function UserDashboardRoute() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="app-container">
      <header className="app-header items-center gap-4">
        <AvatarAuto user={user} imageUrl={user.images[0]?.url} />

        <div>
          <h2>
            <span className="hidden lg:inline">Hi, </span>
            {user.fullname}
          </h2>
          <p className="text-primary-foreground">
            <span>{user.email} / </span>
            <Link to={`/${user.username}`} className="hover:text-primary">
              @{user.username}
            </Link>
          </p>
        </div>
      </header>
      <div>Hello world</div>
    </div>
  )
}
