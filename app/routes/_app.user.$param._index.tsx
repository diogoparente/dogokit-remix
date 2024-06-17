import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { zx } from "zodix"

import { ErrorHelpInformation } from "~/components/shared/error-boundary"
import { AvatarAuto } from "~/components/ui/avatar-auto"
import { ButtonLink } from "~/components/ui/button-link"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { modelPage } from "~/models/page.server"
import { modelUser } from "~/models/user.server"
import { invariant } from "~/utils/invariant"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

/**
 * $param splat route can check for:
 * 1. User from database
 * 2. If nothing found, tell it doesn’t exist
 */

export const handle = createSitemap()

export const meta: MetaFunction<typeof loader> = ({ params, data }) => {
  const user = data?.user

  if (user) {
    return createMeta({
      title: `${user.fullname} (@${user.username})`,
      description: user.profiles[0]?.bio ?? "",
      canonicalPath: user.username ?? "",
    })
  }

  return createMeta({
    title: "User profile is not found",
    description: `Cannot find user "${params.param}"`,
  })
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { param } = zx.parseParams(params, { param: z.string() })
  invariant(param, "param unavailable")

  const page = await modelPage.getBySlug({ slug: param })
  const user = await modelUser.getByUsername({ username: param })

  if (page) return json({ page, user: null })
  if (user) return json({ user, page: null })

  return json({ user: null }, { status: 404 })
}

export default function ParamRoute() {
  const { userSession } = useRootLoaderData()
  const { user } = useLoaderData<typeof loader>()

  if (user) {
    const profile = user.profiles[0]
    const isOwner = user.id === userSession?.id

    return (
      <div className="site-container space-y-8">
        <section className="site-section my-4 space-y-2">
          <div className="flex flex-wrap items-end justify-between">
            <AvatarAuto
              user={user}
              imageUrl={user.images[0]?.url}
              className="outline outline-2 outline-background"
              size="xl"
            />
            {isOwner && (
              <ButtonLink to="/settings" prefetch="intent" variant="outline" size="sm">
                Edit profile
              </ButtonLink>
            )}
          </div>

          <div>
            <h2 className="text-3xl">{user.fullname}</h2>
            <h3 className="text-2xl text-primary-foreground">@{user.username}</h3>
          </div>
        </section>

        {profile && (
          <section className="site-section space-y-2">
            <h4>{profile.headline}</h4>
            <p className="prose-config">{profile.bio}</p>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="site-container">
      <section className="site-section prose-config">
        <h1>Sorry, user could not be found</h1>
        <p>The requested page or user either doesn’t exist or you don’t have access to it.</p>
      </section>
      <ErrorHelpInformation />
    </div>
  )
}
