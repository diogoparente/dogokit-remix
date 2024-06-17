import { json } from "@remix-run/node"

import { modelCompanyRole } from "~/models/company-role.server"
import { createTimer } from "~/utils/timer"

export const update = async ({
  data: { companyId, name, newName },
}: {
  data: { companyId: string; name: string; newName: string }
}) => {
  const timer = createTimer()

  try {
    const category = await modelCompanyRole.getByCompanyIdAndName({ companyId, name })
    if (category) {
      const deletedCategory = await modelCompanyRole.updateById({
        id: category?.id,
        name: newName,
        companyId,
      })

      if (!deletedCategory) {
        await timer.delay()
        return json({ status: "error", message: "Company role does not exist" }, { status: 500 })
      }
      await timer.delay()
      return json({ status: "success", message: "Company role updated" }, { status: 200 })
    }
  } catch (error) {
    return json({ status: "error", message: "Something went wrong" }, { status: 500 })
  }
}
