import { type MetaFunction } from "@remix-run/node"

import { CenteredSection } from "~/components/layout/centered-section"
import { TimeOff } from "~/components/route-wrappers/time-off"
import { GenericErrorMessage } from "~/components/shared/error-boundary"
import { useAppRole } from "~/hooks/use-app-role"
import { createMeta } from "~/utils/meta"

export const meta: MetaFunction = () => createMeta({ title: `Timeoff`, description: `` })

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
      <TimeOff />
    </div>
  )
}
