import { parse } from "@conform-to/zod"
import { json } from "@remix-run/node"
import { z } from "zod"

import { db } from "~/libs/db.server"
import { modelCompanyLocation } from "~/models/company-location.server"
import { schemaCompanyLocation } from "~/schemas/company-location"
import { objectToFormData } from "~/utils/object-to-form-data.server"
import { createTimer } from "~/utils/timer"

export const create = async ({ data }: { data: { companyId: string; name: string } }) => {
  const timer = createTimer()
  let submission

  try {
    submission = await parse(objectToFormData(data), {
      async: true,
      schema: schemaCompanyLocation.superRefine(async (data, ctx) => {
        const existingName = await db.companyRole.findUnique({
          where: { name: data.name, id: data.companyId },
        })
        if (existingName) {
          ctx.addIssue({
            path: ["name"],
            code: z.ZodIssueCode.custom,
            message: "This name is already being used",
          })
          return
        }
      }),
    })
  } catch (error) {
    console.log({ error })
  }

  if (!submission?.value || submission?.intent !== "submit") {
    await timer.delay()
    return json({ status: "error", submission }, { status: 400 })
  }
  try {
    const newLocation = await modelCompanyLocation.create({
      ...submission.value,
    })

    if (!newLocation) {
      await timer.delay()
      return json({ status: "error", submission }, { status: 500 })
    }

    await timer.delay()
    return json({ status: "success", submission }, { status: 200 })
  } catch (error) {
    return json({ status: "error", submission }, { status: 500 })
  }
}
