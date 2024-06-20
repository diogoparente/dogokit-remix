import { type PropsWithChildren } from "react"

import { Title } from "./title"

const Container = ({ children, title }: PropsWithChildren<{ title: string }>) => (
  <div className="app-container">
    <div className="mb-8 flex items-center gap-2">
      <Title>{title}</Title>
    </div>
    <div className="mt-4 flex flex-1 grow flex-col">{children}</div>
  </div>
)

export { Container }
