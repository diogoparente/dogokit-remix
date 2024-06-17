import { json } from "@remix-run/node"

import { modelCompanyCategory } from "~/models/company-category.server"
import { createTimer } from "~/utils/timer"

export const read = async ({ data }: { data: { companyId: string } }) => {
  const timer = createTimer()

  try {
    const categories = await modelCompanyCategory.getAll(data)

    if (!categories) {
      await timer.delay()
      return json({ status: "error" }, { status: 500 })
    }

    await timer.delay()
    return json({ status: "success", categories }, { status: 200 })
  } catch (error) {
    return json({ status: "error" }, { status: 500 })
  }
}
