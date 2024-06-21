import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useQuery } from "@tanstack/react-query"

import { Company } from "~/components/route-wrappers/company"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

import { loader as companyLoader } from "./api.company"

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

export const loader = async (req: LoaderFunctionArgs) => {
  return await companyLoader(req)
}
