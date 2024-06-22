import { json } from "@remix-run/node"

import { modelCompanyLocation } from "~/models/company-location.server"
import { createTimer } from "~/utils/timer"

export const read = async ({ data }: { data: { companyId: string } }) => {
  const timer = createTimer()

  try {
    const locations = await modelCompanyLocation.getAll(data)

    if (!locations) {
      await timer.delay()
      return json({ status: "error" }, { status: 500 })
    }

    await timer.delay()
    return json({ status: "success", locations }, { status: 200 })
  } catch (error) {
    return json({ status: "error" }, { status: 500 })
  }
}
