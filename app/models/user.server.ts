import { type Connection, type User } from "@prisma/client"

import { db } from "~/libs/db.server"
import { hashPassword } from "~/utils/encryption.server"
import { getPlaceholderAvatarUrl } from "~/utils/placeholder"
import { createNanoIdShort } from "~/utils/string"

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

  async signup({
    email,
    fullname,
    username,
    password,
    // @ts-ignore
  }: Pick<User, "fullname" | "username" | "email"> & {
    password: string // unencrypted password at first
    inviteBy?: string
    inviteCode?: string
  }) {
    // The logic is in Conform Zod validation
    return db.user.create({
      data: {
        fullname: fullname.trim(),
        username: (username as string).trim(),
        email: email.trim(),
        roles: { connect: { symbol: "NORMAL" } },
        password: { create: { hash: await hashPassword(password) } },
        images: { create: { url: getPlaceholderAvatarUrl(username as string) } },
        activated: false,
        profiles: {
          create: {
            modeName: `Default ${fullname}`,
            headline: `The headline of ${fullname}`,
            bio: `The bio of ${fullname} for longer description.`,
          },
        },
      },
    })
  },

  async continueWithService({
    email,
    fullname,
    username,
    providerName,
    providerId,
    imageUrl,
    // @ts-ignore
  }: Pick<User, "email" | "fullname" | "username"> &
    Pick<Connection, "providerName" | "providerId"> & { imageUrl: string }) {
    const existingUsername = await modelUser.getByUsername({ username })
    const existingUser = await modelUser.getByEmail({ email })

    try {
      return db.user.upsert({
        where: { email },
        create: {
          activated: false,
          email,
          fullname,
          roles: { connect: { symbol: "NORMAL" } },
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

  // @ts-ignore
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
}
