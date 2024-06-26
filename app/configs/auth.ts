/**
 * EDITME: Auth Config
 *
 * Auth-related configuration
 */

import { AuthStrategies } from "~/services/auth-strategies"
import { type AuthStrategy } from "~/services/auth.server"

export const configAuth: ConfigAuth = {
  services: [
    {
      label: "Google",
      provider: AuthStrategies.GOOGLE,
      isEnabled: true,
    },
    {
      label: "Auth0",
      provider: AuthStrategies.AUTH0,
      isEnabled: false,
    },
  ],
}

type ConfigAuth = {
  services: {
    label: string
    provider: AuthStrategy
    isEnabled?: boolean
  }[]
}
