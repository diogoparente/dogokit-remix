import {
  json,
  redirect,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node"
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react"
import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { useDehydratedState } from "use-dehydrated-state"

import { GeneralErrorBoundary } from "~/components/shared/error-boundary"
import { ThemeProvider, type Theme } from "~/components/shared/theme"
import { configDocumentLinks } from "~/configs/document"
import { configSite } from "~/configs/site"
import { Document } from "~/document"
import { modelUser } from "~/models/user.server"
import { authService } from "~/services/auth.server"
import { getThemeSession } from "~/services/theme.server"
import { parsedEnvClient } from "~/utils/env.server"
import { createMeta } from "~/utils/meta"
import { createSitemap } from "~/utils/sitemap"

import { generateToken } from "./services/token.server"

export const handle = createSitemap()

export const meta: MetaFunction = () =>
  createMeta({
    title: configSite.title,
    description: configSite.description,
  })

export const links: LinksFunction = () => configDocumentLinks

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request)
  const theme = themeSession.getTheme()

  const userSession = await authService.isAuthenticated(request)
  if (!userSession) {
    return json({
      ENV: parsedEnvClient,
      theme,
      userSession: null,
      userData: null,
    })
  }

  const userData = await modelUser.getForSession({ id: userSession.id })
  const role = userData?.roles[0]?.symbol
  const email = userData?.email
  const token = email ? await generateToken({ email: userData!.email }) : ""

  if (!userData) return redirect(`/logout`)

  return json({
    ENV: parsedEnvClient,
    theme,
    userSession,
    userData,
    token,
    role,
  })
}

function RootRoute() {
  const data = useLoaderData<typeof loader>()
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider specifiedTheme={data.theme}>
        <Document dataTheme={data.theme}>
          <Outlet />
        </Document>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default withSentry(RootRoute)

export function ErrorBoundary() {
  const error = useRouteError()
  captureRemixErrorBoundaryError(error)

  return (
    <ThemeProvider specifiedTheme={"" as Theme}>
      <Document>
        <GeneralErrorBoundary />
      </Document>
    </ThemeProvider>
  )
}
