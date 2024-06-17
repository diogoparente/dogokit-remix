import { json } from "@remix-run/node"

import { modelCompanyRole } from "~/models/company-role.server"
import { createTimer } from "~/utils/timer"

export const read = async ({ data }: { data: { companyId: string } }) => {
  const timer = createTimer()

  try {
    const roles = await modelCompanyRole.getAll(data)

    if (!roles) {
      await timer.delay()
      return json({ status: "error" }, { status: 500 })
    }

    await timer.delay()
    return json({ status: "success", roles }, { status: 200 })
  } catch (error) {
    return json({ status: "error" }, { status: 500 })
  }
}
