import { type MetaFunction } from "@remix-run/node"

import { CenteredSection } from "~/components/layout/centered-section"
import { JobOpeningsManager } from "~/components/route-wrappers/job-openings/manager"
import { GenericErrorMessage } from "~/components/shared/error-boundary"
import { useAppRole } from "~/hooks/use-app-role"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export const meta: MetaFunction = () => createMeta({ title: `Job Openings` })

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
      <JobOpeningsManager />
    </div>
  )
}
