import { Button } from "~/components/ui/button"
import { ButtonLink } from "~/components/ui/button-link"
import { Card } from "~/components/ui/card"
import { Container } from "~/components/ui/container"
import { SubTitle } from "~/components/ui/sub-title"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"

const fakeRoles: { [key: string]: string[] } = {
  Engineering: ["hello"],
  Marketing: ["world", "world", "world", "world", "world"],
}

const CreateRole = () => (
  <div className="flex flex-row justify-end p-4">
    <ButtonLink to={"/job-listings/create"}>Create</ButtonLink>
  </div>
)

const OpenRoles = () => (
  <div className="flex flex-1 flex-col gap-4 p-4">
    {Object.entries(fakeRoles).map(([category, roles]) => (
      <div key={category} className="flex flex-col gap-4">
        <div className="text-2xl font-medium text-secondary">{category}</div>
        <div key={category} className="flex flex-wrap gap-4">
          {roles.map(role => (
            <Card isHoverable={true} key={role} className="max-w-96 flex-1">
              <div className="flex justify-between">
                {role}
                <Button variant={"outline"}>View</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const JobOpenings = () => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <Container title="Job Openings">
      <div className="flex flex-1 justify-between">
        <SubTitle className="text-foreground">Open Roles</SubTitle>
        <CreateRole />
      </div>
      <Card className="flex flex-1 grow flex-col gap-4">
        <OpenRoles />
      </Card>
    </Container>
  )
}

export { JobOpenings }
