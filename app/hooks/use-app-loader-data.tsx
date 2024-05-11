import { type PageStatus } from "@prisma/client"

import { useMatchesData } from "~/hooks/use-root-loader-data"

export function useAppAdminLoaderData() {
  const appAdminData = useMatchesData("routes/_app.admin") as {
    pageStatuses: PageStatus[]
  }

  return {
    pageStatuses: appAdminData?.pageStatuses,
  }
}
