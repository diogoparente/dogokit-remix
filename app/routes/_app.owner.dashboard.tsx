import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { OnboardingDialog } from "~/components/shared/dialogs/onboarding"
import { AvatarAuto } from "~/components/ui/avatar-auto"
import { requireUser } from "~/helpers/auth"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { modelUser } from "~/models/user.server"
import { authService } from "~/services/auth.server"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export const meta: MetaFunction = () =>
  createMeta({ title: `Owner Dashboard`, description: `Dashboard for owner` })

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { userIsAllowed } = await requireUser(request, ["ADMIN"])
  if (!userIsAllowed) return redirect("/")

  const userSession = await authService.isAuthenticated(request)
  if (!userSession) return redirect("/")

  const user = await modelUser.getForSession({ id: userSession.id })

  return json({ activated: !user?.activated })
}

export default function OwnerDashboardRoute() {
  const { activated } = useLoaderData<typeof loader>()
  const { userData, token } = useRootLoaderData()

  if (!userData) return null

  if (!activated) {
    return (
      <div className="relative">
        <header className="app-header items-center gap-2 sm:gap-4">
          <div>
            <AvatarAuto user={userData} imageUrl={userData.images[0]?.url} />
          </div>

          <div>
            <h2>Welcome!</h2>
            <p className="text-primary-foreground">
              <span>{userData.email}</span>
            </p>
          </div>
        </header>
        <OnboardingDialog token={token!} />
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header items-center gap-2 sm:gap-4">
        <div>
          <AvatarAuto user={userData} imageUrl={userData.images[0]?.url} />
        </div>

        <div>
          <h2>Owner Dashboard</h2>
          <p className="text-primary-foreground">
            <span>{userData.email}</span>
          </p>
        </div>
      </header>
    </div>
  )
}
