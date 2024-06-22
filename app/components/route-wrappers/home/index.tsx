import { Container } from "~/components/ui/container"
import { SubTitle } from "~/components/ui/sub-title"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

const greetUser = (fullname: string) => {
  const now = new Date()
  const hour = now.getHours()
  const name = fullname.split(" ")[0]
  let part
  if (hour >= 5 && hour < 12) {
    part = "morning"
  } else if (hour >= 12 && hour < 18) {
    part = "afternoon"
  } else {
    part = "night"
  }
  return `Good ${part}, ${name} 👋`
}

const Home = () => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <Container title="Home">
      <div className="flex flex-1 justify-between">
        <SubTitle className="text-foreground">{greetUser(userData!.fullname!)}</SubTitle>
      </div>
    </Container>
  )
}

export { Home }
