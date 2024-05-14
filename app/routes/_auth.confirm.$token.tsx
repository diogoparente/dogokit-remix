import { redirect, type LoaderFunction } from "@remix-run/node"

import { modelUser } from "~/models/user.server"
import { authService } from "~/services/auth.server"
import { verifyToken } from "~/services/token.server"

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const token = url.pathname.split("/")[2]! // Assumes token is always present in the URL

  try {
    const { email } = await verifyToken(token) // Destructure email directly from the verified token

    if (email) {
      const user = await modelUser.activateByEmail({ email })

      if (user) {
        const body = new FormData()
        body.append("email", email)

        // Create a new Request with the original headers, adding the session cookie
        const req = new Request(request.url, {
          method: "POST",
          headers: { ...request.headers },
          body,
        })

        // Pass the modified request to the authService.authenticate function
        return authService.authenticate("form", req, {
          successRedirect: user.companyId ? "/user/dashboard" : "/owner/dashboard",
          failureRedirect: "/login", // Ensure you have a failureRedirect in case of authentication failure
        })
      } else {
        return redirect(`/confirm/failure/${token}`)
      }
    } else {
      return redirect(`/signup`)
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    return redirect(`/signup`)
  }
}
