import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { zx } from "zodix"

import { CenteredSection } from "~/components/layout/centered-section"
import { JobOpeningDetail } from "~/components/route-wrappers/job-openings/detail"
import { GenericErrorMessage } from "~/components/shared/error-boundary"
import { useAppRole } from "~/hooks/use-app-role"
import { modelJob } from "~/models/job-opening.server"
import { invariant } from "~/utils/invariant"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export async function loader({ params }: LoaderFunctionArgs) {
  const { param } = zx.parseParams(params, { param: z.string() })
  invariant(param, "param unavailable")

  // implement getBySlug
  const jobOpeningDetail = await modelJob.getBySlug({ slug: param })

  if (jobOpeningDetail) {
    return json({ jobOpeningDetail })
  }

  return json({ jobOpeningDetail: null }, { status: 404 })
}

export default function JobOpeningDetailRoute() {
  const { jobOpeningDetail } = useLoaderData<typeof loader>()

  const { isManager } = useAppRole()

  if (!jobOpeningDetail) {
    return (
      <CenteredSection>
        <GenericErrorMessage />
      </CenteredSection>
    )
  }

  if (!isManager) {
    return (
      <CenteredSection>
        <GenericErrorMessage />
      </CenteredSection>
    )
  }

  return (
    <div className="relative">
      <JobOpeningDetail />
    </div>
  )
}
