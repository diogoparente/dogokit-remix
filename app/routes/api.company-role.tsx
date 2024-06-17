import { type ActionFunctionArgs } from "@remix-run/server-runtime"

import { create } from "~/api/company-role/create.server"
import { remove } from "~/api/company-role/delete.server"
import { read } from "~/api/company-role/read.server"
import { update } from "~/api/company-role/update.server"

export const loader = async ({ request }: ActionFunctionArgs) => {
  // to-do: use companyId from parameter

  return await read({ data: { companyId: "mock-company" } })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json()
  switch (request.method) {
    case "POST": {
      return await create({ data })
    }
    case "PATCH": {
      return await update({ data })
    }
    case "DELETE": {
      return await remove({ data })
    }
  }
}
