import { type Company } from "@prisma/client"

import { db } from "~/libs/db.server"
import { createNanoId } from "~/utils/string"

export const modelCompany = {
  count() {
    return db.company.count()
  },

  getAll() {
    return db.company.findMany({
      include: {},
    })
  },

  getAllUsers() {
    return db.company.findMany({
      select: {
        users: true,
      },
      orderBy: {
        name: "asc",
      },
    })
  },

  getById({ id }: Pick<Company, "id">) {
    return db.company.findUnique({ where: { id } })
  },

  async create({
    companyId,
    name = "",
    location = "",
  }: {
    companyId?: string
    name?: string
    location?: string
  }) {
    return await db.company.create({
      data: {
        id: companyId ?? createNanoId(),
        name: name.trim(),
        location: location.trim(),
      },
    })
  },

  deleteById({ id }: Pick<Company, "id">) {
    return db.company.delete({ where: { id } })
  },

  updateCompany({ id, data }: { id: string; data: Partial<Company> }) {
    return db.company.update({
      where: { id },
      data,
    })
  },

  updateName({ id, name }: Pick<Company, "id" | "name">) {
    return db.company.update({
      where: { id },
      data: { name: name as string },
    })
  },

  updateLocation({ id, location }: Pick<Company, "id" | "location">) {
    return db.company.update({
      where: { id },
      data: { location },
    })
  },
}
