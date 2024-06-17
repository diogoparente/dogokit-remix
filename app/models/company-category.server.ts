import { type CompanyCategory } from "@prisma/client"

import { db } from "~/libs/db.server"

export const modelCompanyCategory = {
  count() {
    return db.companyCategory.count()
  },

  getAll({ companyId }: Pick<CompanyCategory, "companyId">) {
    const companyCategories = db.companyCategory.findMany({
      where: { companyId },
      select: { name: true, companyId: true, id: true },
    })

    return companyCategories
  },

  getByCompanyIdAndName({ companyId, name }: Pick<CompanyCategory, "companyId" | "name">) {
    return db.companyCategory.findFirst({
      where: { companyId, name },
    })
  },

  getById({ id }: Pick<CompanyCategory, "id">) {
    return db.companyCategory.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, fullname: true } },
        company: true,
      },
    })
  },

  async create({ name, companyId }: Pick<CompanyCategory, "name" | "companyId">) {
    let res

    const exists = await db.companyCategory.findFirst({
      select: { name: true },
      where: { companyId, name },
    })
    if (exists) {
      console.error(`Company category already exists -> ${name}`)

      throw Error(`Company category already exists -> ${name}`)
    }
    try {
      res = await db.companyCategory.create({
        data: {
          name,
          companyId,
        },
      })
      return res
    } catch (error) {
      console.error(`Something went wrong when trying to create company category ${name}`)
      throw Error(`Something went wrong when trying to create company category ${name}`)
    }
  },

  updateById({ id, name, companyId }: Pick<CompanyCategory, "id" | "name" | "companyId">) {
    return db.companyCategory.update({
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

  deleteById({ id }: Pick<CompanyCategory, "id">) {
    return db.companyCategory.delete({
      where: { id },
    })
  },

  search({ q }: { q: string }) {
    return db.companyCategory.findMany({
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
