import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { Form } from "@remix-run/react"
import { useEffect, useState, type FormEvent } from "react"
import { type z } from "zod"

import { CenteredSection } from "~/components/layout/centered-section"
import { ButtonLoading } from "~/components/ui/button-loading"
import { FormErrors, FormField, FormLabel } from "~/components/ui/form"
import { InputPassword } from "~/components/ui/input-password"
import { schemaUserPasswordReset } from "~/schemas/user"

const PasswordReset = ({
  token,
  description,
  onNext,
}: {
  token: string
  description: string
  onNext?: () => void
}) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string>("")

  const [passwordValue, setPasswordValue] = useState("")
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("")

  const [form, { confirmPassword, password }] = useForm<z.infer<typeof schemaUserPasswordReset>>({
    id: "passwordReset",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserPasswordReset })
    },
  })

  useEffect(() => {
    setIsEnabled(passwordValue === confirmPasswordValue && passwordValue !== "")
  }, [passwordValue, confirmPasswordValue])

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value)
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordValue(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission
    const formData = new FormData(event.currentTarget)

    formData.append("token", token)

    try {
      setIsSubmitting(true)
      const response = await fetch("/auth/reset-password", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitting(false)
        onNext && onNext()
      } else {
        setIsSubmitting(false)
        setMessage(result.error || "An error occurred.")
      }
    } catch (error) {
      setMessage("Network error: could not connect to server.")
    }
  }

  return (
    <CenteredSection>
      <section>
        {description ? <p className="mb-4">{description}</p> : null}

        <Form {...form.props} onSubmit={handleSubmit} className="flex flex-col gap-2">
          <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
            <FormField>
              <FormLabel htmlFor={password.id}>Password</FormLabel>
              <InputPassword
                {...conform.input(password, {
                  description: true,
                })}
                id={password.id}
                autoFocus={!!password.error}
                required
                className="w-full"
                value={passwordValue}
                onChange={handlePasswordChange}
              />
              <FormErrors>{password}</FormErrors>
            </FormField>

            <FormField>
              <FormLabel htmlFor={confirmPassword.id}>Confirm Password</FormLabel>
              <InputPassword
                {...conform.input(confirmPassword, {
                  description: true,
                })}
                id={confirmPassword.id}
                placeholder="Enter password"
                autoFocus={!!confirmPassword.error}
                required
                className="w-full"
                value={confirmPasswordValue}
                onChange={handleConfirmPasswordChange}
              />

              <FormErrors>{confirmPassword}</FormErrors>
            </FormField>

            <ButtonLoading
              type="submit"
              loadingText="Submitting..."
              isLoading={isSubmitting}
              variant="default"
              disabled={!isEnabled}
            >
              Reset Password
            </ButtonLoading>
          </fieldset>
        </Form>
      </section>
    </CenteredSection>
  )
}

export { PasswordReset }
