import { modelUser } from "~/models/user.server"
import { authService } from "~/services/auth.server"

export const getUserSession = async ({ request }: { request: Request }) => {
  const userSession = await authService.isAuthenticated(request)

  if (!userSession) {
    return null
  } else {
    const userData = await modelUser.getForSession({ id: userSession.id })
    return { userData }
  }
}
