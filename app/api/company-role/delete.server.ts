import { json } from "@remix-run/node"

import { modelCompanyRole } from "~/models/company-role.server"
import { createTimer } from "~/utils/timer"

export const remove = async ({
  data: { companyId, name },
}: {
  data: { companyId: string; name: string }
}) => {
  const timer = createTimer()

  try {
    const category = await modelCompanyRole.getByCompanyIdAndName({ companyId, name })
    if (category) {
      const deletedCategory = await modelCompanyRole.deleteById({ id: category?.id })

      if (!deletedCategory) {
        await timer.delay()
        return json({ status: "error", message: "Company role does not exist" }, { status: 500 })
      }
      await timer.delay()
      return json({ status: "success", message: "Company role deleted" }, { status: 200 })
    }
  } catch (error) {
    return json({ status: "error", message: "Something went wrong" }, { status: 500 })
  }
}
