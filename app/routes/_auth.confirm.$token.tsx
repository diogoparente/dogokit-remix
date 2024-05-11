import { redirect, type LoaderFunction } from "@remix-run/node"

import { modelUser } from "~/models/user.server"
import { authService, verifyToken } from "~/services/auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const token = url.pathname.split("/")[2]!
  let email
  try {
    email = await verifyToken(token).email
  } catch (error) {
    return redirect(`/signup`)
  }
  if (email) {
    const user = await modelUser.activateByEmail({ email })

    if (user) {
      // Create a new FormData object and append the email
      const formData = new FormData()
      formData.append("email", email)

      const req = new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: formData,
      })

      if (!user.companyId) {
        return authService.authenticate("form", req, {
          successRedirect: "/owner/dashboard",
        })
      }
      // Pass the formDataFromBody to the authService.authenticate function
      return authService.authenticate("form", req, {
        successRedirect: "/user/dashboard",
      })
    } else {
      // If the token is invalid, redirect to the signup failure page
      return redirect(`/confirm/failure/${token}`)
    }
  }
}
