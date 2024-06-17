import { type Page } from "@prisma/client"

import { db } from "~/libs/db.server"

export const modelJob = {
  count() {
    return db.page.count()
  },

  getAll() {
    return db.page.findMany({
      where: { status: { symbol: "PUBLISHED" } },
    })
  },

  getAllSlugs() {
    return db.page.findMany({
      where: { status: { symbol: "PUBLISHED" } },
      select: { slug: true, updatedAt: true },
    })
  },

  getById({ id }: Pick<Page, "id">) {
    return db.page.findUnique({
      where: { id },
      include: {
        status: { select: { symbol: true, name: true } },
      },
    })
  },

  _getBySlug({ slug }: Pick<Page, "slug">) {
    return db.page.findUnique({
      where: {
        slug,
      },
      include: {
        status: { select: { symbol: true, name: true } },
        user: {
          include: {
            images: { select: { id: true, url: true } },
          },
        },
      },
    })
  },

  getBySlug({ slug }: Pick<Page, "slug">) {
    return {
      title: "hello",
      slug,
    }
  },

  search({ q }: { q: string | undefined }) {
    return db.page.findMany({
      where: {
        OR: [{ title: { contains: q } }, { slug: { contains: q } }],
        status: {
          OR: [{ symbol: "PUBLISHED" }],
        },
      },
      orderBy: [{ updatedAt: "asc" }],
    })
  },
}
