import { parse } from "@conform-to/zod"
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useQuery } from "@tanstack/react-query"

import { Company } from "~/components/route-wrappers/company"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { modelCompanyCategory } from "~/models/company-category.server"
import { modelCompanyRole } from "~/models/company-role.server"
import { schemaGeneralId } from "~/schemas/general"
import { createMeta } from "~/utils/meta"
import { getUserSession } from "~/utils/session.server"
import { createSitemap } from "~/utils/sitemap"

export const handle = createSitemap()

export const meta: MetaFunction = () => createMeta({ title: `Company` })

function useCompanyCategories({ token }: { token?: string }) {
  const { companyCategories: loaderCompanyCategories } = useLoaderData<typeof loader>()

  const { data, refetch } = useQuery({
    queryKey: ["company-category"],
    queryFn: async () =>
      await fetch("/api/company-category", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(({ categories }) => categories),
    enabled: !!token,
  })

  const companyCategories = data ?? loaderCompanyCategories

  return { refetchCategories: refetch, companyCategories }
}

function useCompanyRoles({ token }: { token?: string }) {
  const { companyRoles: loaderCompanyRoles } = useLoaderData<typeof loader>()

  const { data, refetch } = useQuery({
    queryKey: ["company-roles"],
    queryFn: async () =>
      await fetch("/api/company-role", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(({ roles }) => roles),
    enabled: !!token,
  })

  const companyRoles = data ?? loaderCompanyRoles

  return { refetchRoles: refetch, companyRoles }
}

export default function CompanyRoute() {
  const { token } = useRootLoaderData()
  const { refetchCategories, companyCategories } = useCompanyCategories({ token })
  const { refetchRoles, companyRoles } = useCompanyRoles({ token })

  return (
    <Company
      refetchCategories={refetchCategories}
      refetchRoles={refetchRoles}
      companyCategories={companyCategories}
      companyRoles={companyRoles}
    />
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaGeneralId })
  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 })
  }
  return json(submission)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const res = await getUserSession({ request })

  const companyId = res?.userData?.company?.id

  const companyCategories = companyId
    ? await modelCompanyCategory.getAll({
        companyId,
      })
    : []

  const companyRoles = companyId
    ? await modelCompanyRole.getAll({
        companyId,
      })
    : []

  return { companyCategories, companyRoles }
}
