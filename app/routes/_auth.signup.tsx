import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { json, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node"
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react"
import { z } from "zod"

import { IconMatch } from "~/components/libs/icon"
import { AuthButtons } from "~/components/shared/auth-buttons"
import { SectionOr } from "~/components/shared/section-or"
import { ButtonLoading } from "~/components/ui/button-loading"
import { FormDescription, FormErrors, FormField, FormLabel } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { InputPassword } from "~/components/ui/input-password"
import { LinkText } from "~/components/ui/link-text"
import { generateUsername } from "~/helpers/auth"
import { useAppMode } from "~/hooks/use-app-mode"
import { db } from "~/libs/db.server"
import { modelUser } from "~/models/user.server"
import { issueUsernameUnallowed, schemaUserSignUp } from "~/schemas/user"
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
  const { isModeDevelopment } = useAppMode()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")

  const [form, { email, fullname, password }] = useForm<z.infer<typeof schemaUserSignUp>>({
    id: "signup",
    lastSubmission: actionData?.submission,
    shouldRevalidate: "onInput",
    constraint: getFieldsetConstraint(schemaUserSignUp),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserSignUp })
    },
    defaultValue: isModeDevelopment
      ? {
          email: "example@example.com",
          fullname: "Your Name",
          password: "",
        }
      : {},
  })

  if (actionData?.status === "success") {
    return (
      <div className="site-container">
        <div className="site-section space-y-8">
          <div className="rounded-md bg-muted p-8">
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
    )
  }

  return (
    <div className="site-container">
      <div className="site-section-md space-y-8">
        <header className="site-header">
          <h2 className="inline-flex items-center gap-2">
            <IconMatch icon="user-plus" />
            <span>Create a new account</span>
          </h2>
          <p>
            Already have an account?{" "}
            <LinkText to="/login" className="transition hover:text-primary">
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
                <FormLabel htmlFor={fullname.id}>Full Name</FormLabel>
                <Input
                  {...conform.input(fullname)}
                  id={fullname.id}
                  placeholder="Full Name"
                  autoFocus={fullname.error ? true : undefined}
                  required
                />
                <FormErrors>{fullname}</FormErrors>
              </FormField>

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
                  placeholder="Enter password (at least 8 characters)"
                  autoComplete="current-password"
                  autoFocus={password.error ? true : undefined}
                  required
                  className="w-full"
                />
                <FormDescription id={password.descriptionId}>8 characters or more</FormDescription>
                <FormErrors>{password}</FormErrors>
              </FormField>

              {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}

              <ButtonLoading type="submit" loadingText="Signing Up..." isLoading={isSubmitting}>
                Sign Up
              </ButtonLoading>
            </fieldset>
          </Form>
        </section>
      </div>
    </div>
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const timer = createTimer()
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  let username = ""
  let currentUserCount

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
          message: "Email cannot be used",
        })
        return
      }

      currentUserCount = await db.user.count()
      username = generateUsername(data.fullname, currentUserCount)!

      const existingUsername = await db.user.findUnique({
        where: { username },
        select: { id: true },
      })
      if (existingUsername) {
        ctx.addIssue(issueUsernameUnallowed)
        return
      }
    }),
  })

  if (!submission.value || submission.intent !== "submit") {
    await timer.delay()
    return json({ status: "error", submission }, { status: 400 })
  }

  const newUser = await modelUser.signup({
    ...submission.value,
    username,
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
}
