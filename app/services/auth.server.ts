import { type Prisma } from "@prisma/client"
import { createCookieSessionStorage } from "@remix-run/node"
import { Authenticator } from "remix-auth"

import { type modelUser } from "~/models/user.server"
import { sessionStorage } from "~/services/session.server"
import { convertDaysToSeconds } from "~/utils/datetime"
import { isProduction, parsedEnv } from "~/utils/env.server"

import { AuthStrategies } from "./auth-strategies"
// import { auth0Strategy } from "./auth-strategies/auth0.strategy"
import { formStrategy } from "./auth-strategies/form.strategy"
import { googleStrategy } from "./auth-strategies/google.strategy"

/**
 * UserSession is stored in the cookie
 */
export interface UserSession {
  id: string
  // Add user properties here or extend with a type from the database
}

/**
 * UserData is not stored in the cookie, only retrieved when necessary
 */
export interface UserData
  extends NonNullable<Prisma.PromiseReturnType<typeof modelUser.getForSession>> {}

export type AuthStrategy = (typeof AuthStrategies)[keyof typeof AuthStrategies]

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authService = new Authenticator<UserSession>(sessionStorage)

export const authStorage = createCookieSessionStorage({
  cookie: {
    name: "__auth_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [parsedEnv.SESSION_SECRET],
    secure: isProduction,
    maxAge: convertDaysToSeconds(30),
  },
})

// Register your strategies below
authService.use(formStrategy, AuthStrategies.FORM)
authService.use(googleStrategy, AuthStrategies.GOOGLE)
