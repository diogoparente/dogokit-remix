import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { json, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node"
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react"
import { z } from "zod"

import { CenteredSection } from "~/components/layout/centered-section"
import { IconMatch } from "~/components/libs/icon"
import { AuthButtons } from "~/components/shared/auth-buttons"
import { SectionOr } from "~/components/shared/section-or"
import { ButtonLoading } from "~/components/ui/button-loading"
import { FormErrors, FormField, FormLabel } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { LinkText } from "~/components/ui/link-text"
import { db } from "~/libs/db.server"
import { modelUser } from "~/models/user.server"
import { schemaUserSignUp } from "~/schemas/user"
import { authService } from "~/services/auth.server"
import { emailRegister } from "~/services/email.server"
import { createMeta } from "~/utils/meta"
import { createTimer } from "~/utils/timer"

export const meta: MetaFunction = () =>
  createMeta({
    title: `Sign Up`,
    description: `Create a new account`,
  })

export const loader = ({ request }: ActionFunctionArgs) => {
  return authService.isAuthenticated(request, {
    successRedirect: "/user/dashboard",
  })
}

export default function SignUpRoute() {
  const actionData = useActionData<typeof action>()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")

  const [form, { email }] = useForm<z.infer<typeof schemaUserSignUp>>({
    id: "signup",
    lastSubmission: actionData?.submission,
    shouldRevalidate: "onInput",
    constraint: getFieldsetConstraint(schemaUserSignUp),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserSignUp })
    },
    defaultValue: {
      email: "",
    },
  })

  if (actionData?.status === "success") {
    return (
      <CenteredSection>
        <div className="site-container">
          <div className="site-section space-y-8">
            <div className="site-section-md rounded-md bg-tertiary p-8">
              <header className="site-header">
                <h2 className="inline-flex items-center gap-2 pb-2">
                  <IconMatch icon="email" />
                  <span>You are in! 🚀</span>
                </h2>
                <p>Check your inbox and activate your account with the magic link we sent you</p>
                <p className="font-extralight">
                  If you can't find it in your inbox, please check your spam
                </p>
              </header>
            </div>
          </div>
        </div>
      </CenteredSection>
    )
  }

  return (
    <CenteredSection>
      <div className="site-container">
        <div className="site-section-md space-y-8">
          <header className="site-header">
            <h2 className="inline-flex items-center gap-2">
              <IconMatch icon="user-plus" />
              <span>Create a new account</span>
            </h2>
            <p>
              Already have an account?{" "}
              <LinkText alt="Log in" to="/login">
                Log in
              </LinkText>
            </p>
          </header>

          <section className="space-y-2">
            <AuthButtons />
          </section>

          <SectionOr />

          <section>
            <Form
              replace
              action="/signup"
              method="POST"
              className="flex flex-col gap-2"
              {...form.props}
            >
              <fieldset className="flex flex-col gap-2" disabled={isSubmitting}>
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
                {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}

                <ButtonLoading
                  type="submit"
                  loadingText="Signing Up..."
                  isLoading={isSubmitting}
                  variant="secondary"
                >
                  Sign Up
                </ButtonLoading>
              </fieldset>
            </Form>
          </section>
        </div>
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
    schema: schemaUserSignUp.superRefine(async (data, ctx) => {
      const existingEmail = await db.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      })
      if (existingEmail) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Email is already being used",
        })
        return
      }
    }),
  })

  if (!submission.value || submission.intent !== "submit") {
    await timer.delay()
    return json({ status: "error", submission }, { status: 400 })
  }
  try {
    const newUser = await modelUser.signup({
      ...submission.value,
    })

    if (!newUser) {
      await timer.delay()
      return json({ status: "error", submission }, { status: 500 })
    }

    if (newUser) {
      await emailRegister({ originUrl: request.headers.get("origin")!, email: newUser.email })
    }

    await timer.delay()
    return json({ status: "success", submission }, { status: 200 })
  } catch (error) {
    return json({ status: "error", submission }, { status: 500 })
  }
}
