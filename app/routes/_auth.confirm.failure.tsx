import { type MetaFunction } from "@remix-run/node"

import { IconMatch } from "~/components/libs/icon"
import { createMeta } from "~/utils/meta"

export const meta: MetaFunction = () =>
  createMeta({
    title: `Sign Up`,
    description: `Get new magic link`,
  })



// TO-DO - add magic link button (a button to trigger a call)
  export default function ConfirmFailure() {
  return (
    <div className="site-container">
      <div className="site-section-md space-y-8">
        <header className="site-header">
          <h2 className="inline-flex items-center gap-2">
            <IconMatch icon="sign-in" />
            <span>Something went wrong</span>
          </h2>
          <p>
            It looks like your token is not valid.
          </p>
        </header>

    
      </div>
    </div>
  )
}

