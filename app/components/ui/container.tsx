import { type PropsWithChildren } from "react"

import { Title } from "./title"

const Container = ({ children, title }: PropsWithChildren<{ title: string }>) => (
  <div className="app-container">
    <Title>{title}</Title>
    <div className="mt-4 flex flex-1 grow flex-col">{children}</div>
  </div>
)

export { Container }
