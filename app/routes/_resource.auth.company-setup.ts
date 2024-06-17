import { json, type ActionFunctionArgs } from "@remix-run/node"

import { modelCompany } from "~/models/company.server"
import { modelUser } from "~/models/user.server"
import { verifyToken } from "~/services/token.server"
import { createTimer } from "~/utils/timer"

export const action = async ({ request }: ActionFunctionArgs) => {
  const timer = createTimer()
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  let values: {
    name?: string
    location?: string
    token?: string
  } = {}
  // Log the FormData entries
  for (const [key, value] of formData.entries()) {
    values = { ...values, [key]: value }
  }

  const name = values?.name
  const location = values?.location
  const token = values?.token

  if (!name) {
    return json({ status: "error", message: "Company name was not provided" }, { status: 403 })
  }
  if (!location) {
    return json({ status: "error", message: "Company location was not provided" }, { status: 403 })
  }

  if (!Object.entries(values).length) {
    await timer.delay()
    return json({ status: "error" }, { status: 403 })
  }

  if (!token) {
    return json(
      { status: "error", message: "Unauthorized request, token was not provided" },
      { status: 403 },
    )
  }
  let company
  let verifiedToken
  try {
    verifiedToken = await verifyToken(token)
  } catch {
    return json(
      { status: "error", message: "Unauthorized request, the provided token is invalid" },
      { status: 403 },
    )
  }

  if (verifiedToken) {
    try {
      const user = await modelUser.getByEmail({ email: verifiedToken.email })
      if (user?.companyId) {
        company = await modelCompany.updateCompany({
          id: user?.companyId,
          data: {
            name,
            location,
          },
        })
      }

      if (company) {
        return json({ status: "success" }, { status: 200 })
      }
    } catch (error) {
      console.log(error)

      return json({ status: "error", message: "Company could not be setup" }, { status: 500 })
    }

    try {
      await timer.delay()
      return json({ status: "success" }, { status: 200 })
    } catch (error) {
      return json({ status: "error" }, { status: 500 })
    }
  }
}
