import { type PropsWithChildren } from "react"

const CenteredSection = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-full min-w-full grow flex-col justify-center">{children}</div>
)

export { CenteredSection }
