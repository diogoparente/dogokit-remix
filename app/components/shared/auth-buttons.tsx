import { configAuth } from "~/configs/auth"

import { FormButtonOAuth } from "./form-button-oauth"

export function AuthButtons() {
  return (
    <>
      {configAuth.services
        .filter(service => service.isEnabled)
        .map(({ isEnabled, ...service }) =>
          isEnabled ? (
            <FormButtonOAuth
              key={service.provider}
              label={service.label}
              provider={service.provider}
            />
          ) : null,
        )}
    </>
  )
}
