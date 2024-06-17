import { Title } from "~/components/ui/title"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

const Home = () => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <div className="app-container">
      <header className="app-header items-center gap-2 sm:gap-4">
        <div>
          <Title>Home</Title>
        </div>
      </header>
    </div>
  )
}

export { Home }
