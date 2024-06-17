import { SubTitle } from "~/components/ui/sub-title"
import { Title } from "~/components/ui/title"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

import { CompanyCategories, type TCompanyCategory } from "./categories"
import { CompanyRoles, type TCompanyRole } from "./roles"

export type TMode = "edit" | "add" | "delete" | null

const Company = ({
  companyCategories,
  refetchCategories,
  companyRoles,
  refetchRoles,
}: {
  companyCategories: TCompanyCategory[]
  refetchCategories: () => void
  companyRoles: TCompanyRole[]
  refetchRoles: () => void
}) => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <div className="app-container">
      <div className="mb-8 flex items-center gap-2">
        <Title>Company</Title>
      </div>

      <div className="flex flex-col gap-8">
        <SubTitle className="text-foreground">Manager</SubTitle>
        <div className="flex flex-col gap-4">
          <CompanyCategories
            companyCategories={companyCategories}
            refetchCategories={refetchCategories}
          />
          <CompanyRoles
            companyRoles={companyRoles}
            refetchRoles={refetchRoles}
          />
        </div>
      </div>
      {/* <div className="flex flex-col gap-8">
        <SubTitle className="text-foreground">Settings</SubTitle>
        <CompanySettings />
      </div> */}
    </div>
  )
}

export { Company }
