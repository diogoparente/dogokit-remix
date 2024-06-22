import { z } from "zod"

import { id } from "~/schemas/general"
import countries from "~/utils/countries"

const name = z
  .string({ required_error: "Name is required" })
  .regex(/^[a-zA-Z\s]+$/, "Only alphabetic characters and spaces are allowed")
  .min(4, "Location name requires at least 4 characters")
  .max(20, "Location name is limited to 20 characters")
  .refine(value => countries.some(country => country.country === value), {
    message: "Name must be one of the specified countries",
  })

export const schemaCompanyLocation = z.object({ companyId: id, name })
