import { Container } from "~/components/ui/container"
import { SubTitle } from "~/components/ui/sub-title"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

import { CompanyCategories, type TCompanyCategory } from "./categories"
import { CompanyLocations, type TCompanyLocation } from "./locations"
import { CompanyRoles, type TCompanyRole } from "./roles"

export type TMode = "edit" | "add" | "delete" | null

const Company = ({
  companyCategories,
  companyLocations,
  companyRoles,
  refetchCategories,
  refetchLocations,
  refetchRoles,
}: {
  companyCategories: TCompanyCategory[]
  refetchCategories: () => void
  companyRoles: TCompanyRole[]
  refetchRoles: () => void
  companyLocations: TCompanyLocation[]
  refetchLocations: () => void
}) => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <Container title="Company">
      <div className="flex flex-col gap-8">
        <SubTitle className="text-foreground">Manager</SubTitle>
        <div className="flex flex-col gap-10">
          <CompanyCategories
            companyCategories={companyCategories}
            refetchCategories={refetchCategories}
          />
          <CompanyRoles companyRoles={companyRoles} refetchRoles={refetchRoles} />
          <CompanyLocations
            companyLocations={companyLocations}
            refetchLocations={refetchLocations}
          />
        </div>
      </div>
      {/* <div className="flex flex-col gap-8">
        <SubTitle className="text-foreground">Settings</SubTitle>
        <CompanySettings />
      </div> */}
    </Container>
  )
}

export { Company }
