import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { json, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node"
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react"
import { z } from "zod"

import { CenteredSection } from "~/components/layout/centered-section"
import { AuthButtons } from "~/components/shared/auth-buttons"
import { Card } from "~/components/shared/card"
import { SectionOr } from "~/components/shared/section-or"
import { ButtonLoading } from "~/components/ui/button-loading"
import { FormDescription, FormErrors, FormField, FormLabel } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { InputPassword } from "~/components/ui/input-password"
import { LinkText } from "~/components/ui/link-text"
import { db } from "~/libs/db.server"
import { schemaUserLogIn } from "~/schemas/user"
import { authService } from "~/services/auth.server"
import { checkPassword } from "~/utils/encryption.server"
import { createMeta } from "~/utils/meta"
import { createTimer } from "~/utils/timer"

export const meta: MetaFunction = () =>
  createMeta({
    title: `Log In`,
    description: `Continue to dashboard`,
  })

export const loader = ({ request }: ActionFunctionArgs) => {
  return authService.isAuthenticated(request, {
    successRedirect: "/home",
  })
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")

  const [form, { email, password }] = useForm<z.infer<typeof schemaUserLogIn>>({
    id: "login",
    lastSubmission: actionData?.submission,
    shouldRevalidate: "onInput",
    constraint: getFieldsetConstraint(schemaUserLogIn),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserLogIn })
    },
    defaultValue: {},
  })

  return (
    <CenteredSection>
      <div className="site-container">
        <Card icon="sign-in" label="Log in to continue">
          <header className="site-header">
            <p>
              Don't have an account?{" "}
              <LinkText alt="sign up" to="/signup" className="transition">
                Sign up
              </LinkText>
            </p>
          </header>

          <AuthButtons />

          <SectionOr />

          <section>
            <Form
              replace
              action="/login"
              method="POST"
              className="flex flex-col gap-2"
              {...form.props}
            >
              <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
                {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
                <FormField>
                  <FormLabel htmlFor={email.id}>Email</FormLabel>
                  <Input
                    {...conform.input(email, {
                      type: "email",
                      description: true,
                    })}
                    id={email.id}
                    placeholder="yourname@example.com"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoFocus={email.error ? true : undefined}
                    required
                  />
                  <FormErrors>{email}</FormErrors>
                </FormField>

                <FormField>
                  <FormLabel htmlFor={password.id}>Password</FormLabel>
                  <InputPassword
                    {...conform.input(password, {
                      description: true,
                    })}
                    id={password.id}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    autoFocus={password.error ? true : undefined}
                    required
                    className="w-full"
                  />
                  <FormDescription id={password.descriptionId}>
                    At least 8 characters
                  </FormDescription>
                  <FormErrors>{password}</FormErrors>
                </FormField>

                <ButtonLoading
                  className="mt-2"
                  type="submit"
                  loadingText="Logging In..."
                  isLoading={isSubmitting}
                  variant="secondary"
                >
                  Log In
                </ButtonLoading>
              </fieldset>
            </Form>
          </section>
        </Card>
      </div>
    </CenteredSection>
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const timer = createTimer()
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const submission = await parse(formData, {
    async: true,
    schema: schemaUserLogIn.superRefine(async (data, ctx) => {
      const existingUser = await db.user.findUnique({
        where: { email: data.email },
        include: { password: true },
      })
      if (!existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "User with this email is not found",
        })
        return
      }
      if (!existingUser?.password) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "User cannot log in with a password. Try using 3rd party services below",
        })
        return
      }

      const isPasswordCorrect = await checkPassword(data.password, existingUser.password.hash)
      if (!isPasswordCorrect) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password is incorrect",
        })
        return
      }
    }),
  })

  await timer.delay()

  if (!submission.value || submission.intent !== "submit") {
    return json({ status: "error", submission }, { status: 400 })
  }

  return authService.authenticate("form", request, {
    successRedirect: "/home",
  })
}
