import { json } from "@remix-run/node"
import { SMTPClient } from "emailjs"
import jwt from "jsonwebtoken"

const client = new SMTPClient({
  user: process.env.SMTP_EMAIL! ?? "email_not_provided",
  password: process.env.SMTP_PASS! ?? "pass_not_provided",
  host: process.env.SMTP_HOST! ?? "host_not_provided",
  ssl: true,
})

export const emailRegister = async ({ originUrl, email }: { originUrl: string; email: string }) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" })
  const magicLink = `${originUrl}/confirm/${token}`

  try {
    await client.sendAsync({
      subject: "Welcome! Here's Your Magic Link",
      text: `
      You're just one click away from activating your account.
      Click here to activate it: ${magicLink}`,
      from: process.env.SMTP_EMAIL! ?? "email_not_provided",
      to: email,
    })

    return json({ message: "Magic link sent!", status: 200 })
  } catch {
    return json({ message: "Something went wrong!", status: 500 })
  }
}
