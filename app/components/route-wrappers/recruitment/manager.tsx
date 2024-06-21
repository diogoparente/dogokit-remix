import { Card } from "~/components/ui/card"
import { SubTitle } from "~/components/ui/sub-title"
import { Title } from "~/components/ui/title"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

const ManageCategories = () => {
  return <Card className="flex-1 grow">Manage categories</Card>
}

const ManagePublishedJobs = () => {
  return <Card className="flex-1 grow">Manage published jobs</Card>
}

const ManageRoles = () => {
  return <Card className="flex-1 grow">Manage roles</Card>
}

const JobOpeningsManager = () => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <div className="app-container">
      <Title>Recruitment</Title>
      <SubTitle>Manager</SubTitle>
      <div className="flex flex-col gap-2">
        <div className="flex grow gap-2 ">
          <ManageCategories />
          <ManagePublishedJobs />
        </div>
        <div className="flex grow gap-2">
          <ManageRoles />
          <Card className="flex-1">1</Card>
        </div>
      </div>
    </div>
  )
}

export { JobOpeningsManager }
