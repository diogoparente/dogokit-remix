import { json } from "@remix-run/node"

import { modelCompanyLocation } from "~/models/company-location.server"
import { createTimer } from "~/utils/timer"

export const update = async ({
  data: { companyId, name, newName },
}: {
  data: { companyId: string; name: string; newName: string }
}) => {
  const timer = createTimer()

  try {
    const category = await modelCompanyLocation.getByCompanyIdAndName({ companyId, name })
    if (category) {
      const deletedCategory = await modelCompanyLocation.updateById({
        id: category?.id,
        name: newName,
        companyId,
      })

      if (!deletedCategory) {
        await timer.delay()
        return json(
          { status: "error", message: "Company location does not exist" },
          { status: 500 },
        )
      }
      await timer.delay()
      return json({ status: "success", message: "Company location updated" }, { status: 200 })
    }
  } catch (error) {
    return json({ status: "error", message: "Something went wrong" }, { status: 500 })
  }
}
