import { modelCompanyCategory } from "~/models/company-category.server"
import { modelCompanyLocation } from "~/models/company-location.server"
import { modelCompanyRole } from "~/models/company-role.server"

export const read = async ({ data: { companyId } }: { data: { companyId: string } }) => {
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

  const companyLocations = companyId
    ? await modelCompanyLocation.getAll({
        companyId,
      })
    : []

  return { companyCategories, companyRoles, companyLocations }
}
