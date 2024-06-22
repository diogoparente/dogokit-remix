import { json } from "@remix-run/node"

import { modelCompanyLocation } from "~/models/company-location.server"
import { createTimer } from "~/utils/timer"

export const remove = async ({
  data: { companyId, name },
}: {
  data: { companyId: string; name: string }
}) => {
  const timer = createTimer()

  try {
    const category = await modelCompanyLocation.getByCompanyIdAndName({ companyId, name })
    if (category) {
      const deletedCategory = await modelCompanyLocation.deleteById({ id: category?.id })

      if (!deletedCategory) {
        await timer.delay()
        return json(
          { status: "error", message: "Company location does not exist" },
          { status: 500 },
        )
      }
      await timer.delay()
      return json({ status: "success", message: "Company location deleted" }, { status: 200 })
    }
  } catch (error) {
    return json({ status: "error", message: "Something went wrong" }, { status: 500 })
  }
}
