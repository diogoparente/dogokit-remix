import { type Connection, type User } from "@prisma/client"

import { db } from "~/libs/db.server"
import { hashPassword } from "~/utils/encryption.server"
import { getPlaceholderAvatarUrl } from "~/utils/placeholder"
import { createNanoIdShort } from "~/utils/string"

import { modelCompany } from "./company.server"
import { generateTempPassword } from "./helpers/generate-password"

export const modelUser = {
  count() {
    return db.user.count()
  },

  getAll() {
    return db.user.findMany({
      include: {
        images: { select: { url: true }, orderBy: { updatedAt: "desc" } },
      },
    })
  },

  getWithImages() {
    return db.user.findFirst({
      include: {
        images: { select: { url: true }, orderBy: { updatedAt: "desc" } },
      },
    })
  },

  getAllUsernames() {
    return db.user.findMany({
      select: {
        username: true,
        updatedAt: true,
      },
      orderBy: {
        username: "asc",
      },
    })
  },

  getForSession({ id }: Pick<User, "id">) {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullname: true,
        username: true,
        nickname: true,
        companyId: true,
        company: true,
        activated: true,
        onboarded: true,
        email: true,
        roles: { select: { symbol: true, name: true } },
        images: { select: { url: true }, orderBy: { updatedAt: "desc" } },
      },
    })
  },

  getById({ id }: Pick<User, "id">) {
    return db.user.findUnique({ where: { id } })
  },
  // @ts-ignore
  getByUsername({ username }: Pick<User, "username">) {
    return db.user.findUnique({
      where: { username: username as string },
      include: {
        profiles: true,
        roles: { select: { symbol: true, name: true } },
        images: { select: { url: true }, orderBy: { updatedAt: "desc" } },
      },
    })
  },

  getByEmail({ email }: Pick<User, "email">) {
    return db.user.findUnique({
      where: { email },
      select: {
        id: true,
        images: { select: { url: true }, orderBy: { updatedAt: "desc" } },
        companyId: true,
        invited: true,
      },
    })
  },

  search({ q }: { q: string | undefined }) {
    return db.user.findMany({
      where: {
        OR: [{ fullname: { contains: q } }, { username: { contains: q } }],
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        images: { select: { url: true }, orderBy: { updatedAt: "desc" } },
      },
      orderBy: [{ updatedAt: "asc" }],
    })
  },

  login({ email }: Pick<User, "email">) {
    // The logic is in Conform Zod validation
    return db.user.findUnique({ where: { email } })
  },

  async create({
    email,
    fullname = "",
    username = "",
    password,
    invited = false,
  }: {
    email: string
    fullname?: string
    username?: string
    password?: string
    invited?: boolean
    inviteBy?: string
    inviteCode?: boolean
  }) {
    let user

    try {
      const company = await modelCompany.create({})

      // The logic is in Conform Zod validation
      user = await db.user.upsert({
        where: { email },
        create: {
          companyId: company.id,
          activated: false,
          onboarded: false,
          fullname: fullname.trim(),
          username: `${email.split("@")[0]!.trim()}_${createNanoIdShort()}`,
          email: email.trim(),
          roles: { connect: { symbol: invited ? "NORMAL" : "ADMIN" } },
          password: {
            create: {
              hash: password ? await hashPassword(password) : generateTempPassword(),
            },
          },
          images: { create: { url: getPlaceholderAvatarUrl(username as string) } },
          profiles: {
            create: {
              modeName: `Default ${fullname}`,
              headline: `The headline of ${fullname}`,
              bio: `The bio of ${fullname} for longer description.`,
            },
          },
        },
        update: {
          activated: true,
          onboarded: true,
        },
      })
    } catch (error) {
      console.error(error)
      return null
    }

    return user
  },

  async continueWithService({
    email,
    fullname,
    username,
    providerName,
    providerId,
    imageUrl,
  }: Pick<User, "email" | "fullname" | "username"> &
    Pick<Connection, "providerName" | "providerId"> & { imageUrl: string }) {
    const existingUsername = await modelUser.getByUsername({ username })
    const existingUser = await modelUser.getByEmail({ email })
    const company = await modelCompany.create({})
    try {
      return db.user.upsert({
        where: { email },
        create: {
          companyId: company.id,
          activated: true,
          email,
          fullname,
          roles: { connect: { symbol: "ADMIN" } },
          username: existingUsername ? `${username}_${createNanoIdShort()}` : (username as string),
          images: {
            create: { url: imageUrl || getPlaceholderAvatarUrl(username as string) },
          },
          connections: {
            connectOrCreate: {
              where: { providerId_providerName: { providerName, providerId } },
              create: { providerName, providerId },
            },
          },
        },
        update: {
          images: !existingUser?.images[0]?.url
            ? { create: { url: imageUrl || getPlaceholderAvatarUrl(username as string) } }
            : undefined,
          connections: {
            connectOrCreate: {
              where: { providerId_providerName: { providerName, providerId } },
              create: { providerName, providerId },
            },
          },
        },
        select: { id: true },
      })
    } catch (error) {
      console.error(error)
      return null
    }
  },

  deleteById({ id }: Pick<User, "id">) {
    return db.user.delete({ where: { id } })
  },

  deleteByEmail({ email }: Pick<User, "email">) {
    if (!email) return { error: { email: `Email is required` } }
    return db.user.delete({ where: { email } })
  },

  updateUsername({ id, username }: Pick<User, "id" | "username">) {
    return db.user.update({
      where: { id },
      data: { username: username as string },
    })
  },

  activateByEmail({ email }: Pick<User, "email">) {
    return db.user.update({
      where: { email },
      data: { activated: true },
    })
  },

  onboard({ email }: Pick<User, "email">) {
    return db.user.update({
      where: { email },
      data: {
        onboarded: true,
      },
    })
  },

  setupFirstCompanyUser({ email, companyId }: Pick<User, "email"> & { companyId: string }) {
    return db.user.update({
      where: { email },
      data: {
        companyId,
        onboarded: true,
      },
    })
  },

  updateFullName({ id, fullname }: Pick<User, "id" | "fullname">) {
    return db.user.update({
      where: { id },
      data: { fullname },
    })
  },

  updateNickName({ id, nickname }: Pick<User, "id" | "nickname">) {
    return db.user.update({
      where: { id },
      data: { nickname },
    })
  },

  updateEmail({ id, email }: Pick<User, "id" | "email">) {
    return db.user.update({
      where: { id },
      data: { email },
    })
  },

  async updatePassword({ id, password }: Pick<User, "id"> & { password: string }) {
    return db.user.update({
      where: { id },
      data: {
        password: {
          update: { hash: await hashPassword(password) },
        },
      },
    })
  },
}
