import { json } from "@remix-run/node"
import { SMTPClient } from "emailjs"

import { generateToken } from "./token.server"

const client = new SMTPClient({
  user: process.env.SMTP_EMAIL! ?? "email_not_provided",
  password: process.env.SMTP_PASS! ?? "pass_not_provided",
  host: process.env.SMTP_HOST! ?? "host_not_provided",
  ssl: true,
})

export const emailRegister = async ({ originUrl, email }: { originUrl: string; email: string }) => {
  const token = generateToken({ email })
  const magicLink = `${originUrl}/confirm/${token}`

  try {
    await client.sendAsync({
      subject: "Welcome! Here's your onboarding link 🚀",
      text: `
      You're just one click away from activating your account.
      Click here to start your onboarding process: ${magicLink}`,
      from: process.env.SMTP_EMAIL! ?? "email_not_provided",
      to: email,
    })

    return json({ message: `Magic link sent to ${email}! 🚀`, status: 200 })
  } catch {
    return json({ message: "Something went wrong!", status: 500 })
  }
}
