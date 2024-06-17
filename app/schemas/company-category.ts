import { z } from "zod"

import { id } from "~/schemas/general"

const name = z
  .string({ required_error: "Name is required" })
  .regex(
    /^[a-zA-Z0-9_à-öø-ÿÀ-ÖØ-ß\s]+$/,
    "Only alphabet, number, underscore, spaces, and specific accented characters allowed",
  )
  .min(4, "Category name require at least 4 characters")
  .max(20, "Category name limited to 25 characters")

export const schemaCompanyCategory = z.object({ companyId: id, name })
