import { type MetaFunction } from "@remix-run/node"

import { CenteredSection } from "~/components/layout/centered-section"
import { RequestTimeOff } from "~/components/route-wrappers/time-off/request"
import { GenericErrorMessage } from "~/components/shared/error-boundary"
import { useAppRole } from "~/hooks/use-app-role"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export const meta: MetaFunction = () => createMeta({ title: `Request timeoff`, description: `` })

export default function OnboardingRoute() {
  const { isManager } = useAppRole()

  if (!isManager) {
    return (
      <CenteredSection>
        <GenericErrorMessage />
      </CenteredSection>
    )
  }

  return (
    <div className="relative">
      <RequestTimeOff />
    </div>
  )
}
