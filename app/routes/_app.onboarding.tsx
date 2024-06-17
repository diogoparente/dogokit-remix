import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import OnboardingDialog from "~/components/shared/dialogs/onboarding"
import { checkAllowance, requireUser } from "~/helpers/auth"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { modelCompany } from "~/models/company.server"
import { modelUser } from "~/models/user.server"
import { authService } from "~/services/auth.server"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export const meta: MetaFunction = () => createMeta({ title: `Onboarding`, description: `` })

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { userIsAllowed } = await requireUser(request)
  if (!userIsAllowed) return redirect("/signup")
  const userSession = await authService.isAuthenticated(request)
  if (!userSession) return redirect("/")
  try {
    const user = await modelUser.getForSession({ id: userSession.id })
    if (user) {
      const isAdmin = checkAllowance(["ADMIN"], user)
      const isManager = checkAllowance(["MANAGER"], user)
      const isOnboarded = user?.onboarded

      const company = user?.companyId ? await modelCompany.getById({ id: user?.companyId }) : null
      const isCompanyCreated = !!company?.name

      return json({ isOnboarded, isAdmin, isManager, isCompanyCreated })
    }
    redirect("/signup")
  } catch (error) {
    redirect("/error")
  }
}

export default function OnboardingRoute() {
  const { isOnboarded, isAdmin, isCompanyCreated } = useLoaderData<typeof loader>()
  const { userData, token } = useRootLoaderData()

  if (!userData) return null

  return (
    <div className="relative">
      <OnboardingDialog
        token={token!}
        isAdmin={isAdmin}
        isOnboarded={isOnboarded}
        isCompanyCreated={isCompanyCreated}
      />
    </div>
  )
}
