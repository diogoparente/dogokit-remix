import { Button } from "~/components/ui/button"
import { ButtonLink } from "~/components/ui/button-link"
import { Card } from "~/components/ui/card"
import { Container } from "~/components/ui/container"
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
  <div className="flex w-1/2 flex-col gap-4 p-4">
    <h3 className="text-3xl font-semibold">Open roles</h3>
    {Object.entries(fakeRoles).map(([category, roles]) => (
      <div key={category} className="flex flex-col gap-4">
        <div className="text-2xl font-medium text-secondary">{category}</div>
        {roles.map(role => (
          <Card isHoverable={true} key={role}>
            <div className="flex justify-between">
              {role}
              <Button variant={"outline"}>View</Button>
            </div>
          </Card>
        ))}
      </div>
    ))}
  </div>
)

const JobOpenings = () => {
  const { userData } = useRootLoaderData()

  if (!userData) return null
  return (
    <Container title="Job Openings">
      <CreateRole />
      <div className="flex flex-1 justify-end">
        <OpenRoles />
      </div>
    </Container>
  )
}

export { JobOpenings }
