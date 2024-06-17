import { Title } from "~/components/ui/title"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

const TimeOff = () => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <div className="app-container">
      <header className="app-header items-center gap-2 sm:gap-4">
        <Title>Time off</Title>
      </header>
    </div>
  )
}

export { TimeOff }
