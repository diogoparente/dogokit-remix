import { useRootLoaderData } from "~/hooks/use-root-loader-data"

export function useAppRole() {
  const { role } = useRootLoaderData()

  const isAdmin = role === "ADMIN"
  const isManager = role === "MANAGER" || isAdmin
  const isUser = role === "USER" || isManager || isAdmin

  return {
    isAdmin,
    isManager,
    isUser,
  }
}
