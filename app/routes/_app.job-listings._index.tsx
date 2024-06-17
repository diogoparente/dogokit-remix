import { type MetaFunction } from "@remix-run/node"

import { CenteredSection } from "~/components/layout/centered-section"
import { JobOpenings } from "~/components/route-wrappers/job-openings"
import { GenericErrorMessage } from "~/components/shared/error-boundary"
import { useAppRole } from "~/hooks/use-app-role"
import { createMeta } from "~/utils/meta"

export const meta: MetaFunction = () => createMeta({ title: `Job Openings`, description: `` })

export default function OnboardingRoute() {
  const { isManager } = useAppRole()

  if (!isManager) {
    return (
      <CenteredSection>
        <GenericErrorMessage />
      </CenteredSection>
    )
  }

  return <JobOpenings />
}
