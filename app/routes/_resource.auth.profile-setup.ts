import { json, type ActionFunctionArgs } from "@remix-run/node"

import { modelUser } from "~/models/user.server"
import { verifyToken } from "~/services/token.server"
import { createTimer } from "~/utils/timer"

export const action = async ({ request }: ActionFunctionArgs) => {
  const timer = createTimer()
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  let values: {
    fullname?: string
    dateOfBirth?: string
    country?: string
    confirmPassword?: string
    password?: string
    token?: string
  } = {}

  for (const [key, value] of formData.entries()) {
    values = { ...values, [key]: value }
  }

  const fullname = values?.fullname
  const dateOfBirth = values?.dateOfBirth
  const country = values?.country
  const token = values?.token
  const password = values?.password

  if (!fullname) {
    return json({ status: "error", message: "Fullname was not provided" }, { status: 403 })
  }
  if (!dateOfBirth) {
    return json({ status: "error", message: "Date of birth was not provided" }, { status: 403 })
  }
  if (!country) {
    return json({ status: "error", message: "Country was not provided" }, { status: 403 })
  }

  if (!token) {
    return json(
      { status: "error", message: "Unauthorized request, token was not provided" },
      { status: 403 },
    )
  }

  let verifiedToken
  try {
    verifiedToken = await verifyToken(token)
  } catch {
    return json(
      { status: "error", message: "Unauthorized request, the provided token is invalid" },
      { status: 403 },
    )
  }

  try {
    const email = verifiedToken.email
    const user = await modelUser.getByEmail({ email })

    if (!user) {
      return json(
        { status: "error", message: "No user found for the provided token" },
        { status: 400 },
      )
    }
    console.log({ dateOfBirth })

    if (user && password) {
      await modelUser.setupCompanyUser({
        id: user.id,
        password,
        fullname,
        email,
        dateOfBirth,
        country,
      })
    }
  } catch (error) {
    console.log(error)

    return json({ status: "error" }, { status: 500 })
  }

  if (!Object.entries(values).length) {
    await timer.delay()
    return json({ status: "error" }, { status: 400 })
  }
  try {
    await timer.delay()
    return json({ status: "success" }, { status: 200 })
  } catch (error) {
    return json({ status: "error" }, { status: 500 })
  }
}
