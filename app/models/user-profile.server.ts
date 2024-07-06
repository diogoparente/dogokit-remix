import { type User } from "@prisma/client"

import { db } from "~/libs/db.server"

export const modelUserProfile = {
  count() {
    return db.userProfile.count()
  },

  getAll() {
    return db.userProfile.findMany({})
  },

  getById({ id }: Pick<User, "id">) {
    return db.userProfile.findFirst({ where: { userId: id } })
  },
}
