import { type CompanyRole } from "@prisma/client"

import { db } from "~/libs/db.server"

export const modelCompanyRole = {
  count() {
    return db.companyRole.count()
  },

  getAll({ companyId }: Pick<CompanyRole, "companyId">) {
    const companyRoles = db.companyRole.findMany({
      where: { companyId },
      select: { name: true, companyId: true, id: true },
    })

    return companyRoles
  },

  getByCompanyIdAndName({ companyId, name }: Pick<CompanyRole, "companyId" | "name">) {
    return db.companyRole.findFirst({
      where: { companyId, name },
    })
  },

  getById({ id }: Pick<CompanyRole, "id">) {
    return db.companyRole.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, fullname: true } },
        company: true,
      },
    })
  },

  async create({ name, companyId }: Pick<CompanyRole, "name" | "companyId">) {
    let res

    const exists = await db.companyRole.findFirst({
      select: { name: true },
      where: { companyId, name },
    })
    if (exists) {
      console.error(`Company role already exists -> ${name}`)

      throw Error(`Company role already exists -> ${name}`)
    }
    try {
      res = await db.companyRole.create({
        data: {
          name,
          companyId,
        },
      })
      return res
    } catch (error) {
      console.error(`Something went wrong when trying to create company role ${name}`)
      throw Error(`Something went wrong when trying to create company role ${name}`)
    }
  },

  updateById({ id, name, companyId }: Pick<CompanyRole, "id" | "name" | "companyId">) {
    return db.companyRole.update({
      where: { id },
      data: {
        name,
        companyId,
      },
      include: {
        users: { select: { id: true, fullname: true } },
        company: true,
      },
    })
  },

  deleteById({ id }: Pick<CompanyRole, "id">) {
    return db.companyRole.delete({
      where: { id },
    })
  },

  search({ q }: { q: string }) {
    return db.companyRole.findMany({
      where: {
        OR: [{ name: { contains: q, mode: "insensitive" } }],
      },
      include: {
        users: { select: { id: true, fullname: true } },
        company: true,
      },
    })
  },
}
