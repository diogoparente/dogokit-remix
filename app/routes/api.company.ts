import { type ActionFunctionArgs } from "@remix-run/server-runtime"

import { read } from "~/api/company/read.server"
import { getUserSession } from "~/utils/session.server"

export const loader = async ({ request }: ActionFunctionArgs) => {
  const res = await getUserSession({ request })

  // to-do: add companyId absence handling
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const companyId = res?.userData?.company?.id!
  return await read({ data: { companyId } })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json()
  switch (request.method) {
    case "POST": {
      console.log("not implemented yet", data)

      return
    }
  }
}
