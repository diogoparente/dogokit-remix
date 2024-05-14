import { parse } from "@conform-to/zod"
import { json, type ActionFunctionArgs } from "@remix-run/node"

import { modelUser } from "~/models/user.server"
import { schemaUserPasswordReset } from "~/schemas/user"
import { verifyToken } from "~/services/token.server"
import { createTimer } from "~/utils/timer"

export const action = async ({ request }: ActionFunctionArgs) => {
  const timer = createTimer()
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const submission = await parse(formData, {
    async: true,
    schema: schemaUserPasswordReset,
  })

  const formValues = submission.value

  const token = formValues?.token
  const password = formValues?.password
  const confirmPassword = formValues?.confirmPassword

  if (password !== confirmPassword) {
    console.log("passwords are different")

    return json({ status: "error", submission }, { status: 500 })
  }
  if (!token) {
    console.log("no token")

    return json({ status: "error", submission }, { status: 500 })
  }

  try {
    const email = await verifyToken(token).email

    const user = await modelUser.getByEmail({ email })

    if (!user) {
      console.log("no user")

      return json({ status: "error", submission }, { status: 400 })
    }
    if (user && password) {
      await modelUser.updatePassword({ id: user.id, password })
    }
  } catch (error) {
    console.log(error)

    return json({ status: "error", submission }, { status: 500 })
  }

  if (!submission.value || submission.intent !== "submit") {
    await timer.delay()
    return json({ status: "error", submission }, { status: 400 })
  }
  try {
    await timer.delay()
    return json({ status: "success", submission }, { status: 200 })
  } catch (error) {
    return json({ status: "error", submission }, { status: 500 })
  }
}
