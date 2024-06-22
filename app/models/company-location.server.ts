import { type CompanyLocation } from "@prisma/client"

import { db } from "~/libs/db.server"

export const modelCompanyLocation = {
  count() {
    return db.companyLocation.count()
  },

  getAll({ companyId }: Pick<CompanyLocation, "companyId">) {
    const companyLocations = db.companyLocation.findMany({
      where: { companyId },
      select: { name: true, companyId: true, id: true },
    })

    return companyLocations
  },

  getByCompanyIdAndName({ companyId, name }: Pick<CompanyLocation, "companyId" | "name">) {
    return db.companyLocation.findFirst({
      where: { companyId, name },
    })
  },

  getById({ id }: Pick<CompanyLocation, "id">) {
    return db.companyLocation.findUnique({
      where: { id },
      include: {
        company: true,
      },
    })
  },

  async create({ name, companyId }: Pick<CompanyLocation, "name" | "companyId">) {
    let res

    const exists = await db.companyLocation.findFirst({
      select: { name: true },
      where: { companyId, name },
    })

    if (exists) {
      console.error(`Company location already exists -> ${name}`)

      throw Error(`Company location already exists -> ${name}`)
    }
    try {
      res = await db.companyLocation.create({
        data: {
          name,
          companyId,
        },
      })
      return res
    } catch (error) {
      console.error(`Something went wrong when trying to create company location ${name}`)
      throw Error(`Something went wrong when trying to create company location ${name}`)
    }
  },

  updateById({ id, name, companyId }: Pick<CompanyLocation, "id" | "name" | "companyId">) {
    return db.companyLocation.update({
      where: { id },
      data: {
        name,
        companyId,
      },
      include: {
        company: true,
      },
    })
  },

  deleteById({ id }: Pick<CompanyLocation, "id">) {
    return db.companyLocation.delete({
      where: { id },
    })
  },

  search({ q }: { q: string }) {
    return db.companyLocation.findMany({
      where: {
        OR: [{ name: { contains: q, mode: "insensitive" } }],
      },
      include: {
        company: true,
      },
    })
  },
}
