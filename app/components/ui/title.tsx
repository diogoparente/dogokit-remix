import { type PropsWithChildren } from "react"

const Title = ({ children }: PropsWithChildren) => (
  <h2 className="w-fit rounded-md border border-secondary px-4 py-2 font-display text-xl text-secondary shadow-lg">
    {children}
  </h2>
)

export { Title }
