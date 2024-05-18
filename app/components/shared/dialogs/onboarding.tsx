import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { Form } from "@remix-run/react"
import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { type z } from "zod"

import { Button } from "~/components/ui/button"
import { ButtonLoading } from "~/components/ui/button-loading"
import { DatePicker } from "~/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { FormErrors, FormField, FormLabel } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { InputPassword } from "~/components/ui/input-password"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { schemaUserPasswordReset } from "~/schemas/user"
import countries from "~/utils/countries"

import { PasswordReset } from "../forms/password-reset"

type TOnboardingDialogSkeletonProps = {
  header: string
  content: ReactNode
  open: boolean
}

const OnboardingIntro = ({ nextStep }: { nextStep: () => void }) => (
  <p className="flex flex-col">
    <p className="min-h-16 max-w-[370px]">
      We're so glad to have you onboard! Let's get started by setting up your account.
    </p>
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button key="next" onClick={nextStep}>
        Next
      </Button>
    </div>
  </p>
)

const ProfileSetup = ({ onNext, token }: { onNext: () => void; token: string }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string>("")

  const [fullnameValue, setFullnameValue] = useState("")
  const [countryValue, setCountryValue] = useState("")
  const [dateOfBirthValue, setDateOfBirthValue] = useState("")

  const [passwordValue, setPasswordValue] = useState("")
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("")

  const [form, { confirmPassword, password, fullname, country, dateOfBirth }] = useForm<
    z.infer<typeof schemaUserPasswordReset>
  >({
    id: "passwordReset",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserPasswordReset })
    },
  })

  useEffect(() => {
    setIsEnabled(passwordValue === confirmPasswordValue && passwordValue !== "")
  }, [passwordValue, confirmPasswordValue])

  const handleFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullnameValue(event.target.value)
  }

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
    <p className="flex grow flex-col text-foreground">
      <p className="mb-4">Enter your details below to create your account and get started</p>
      <Form {...form.props} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <fieldset className="mb-4 flex flex-col gap-4">
          <div className="flex gap-4">
            <FormField className="flex-1">
              <FormLabel htmlFor={fullname.id}>Fullname</FormLabel>
              <Input
                {...conform.input(fullname, {
                  type: "name",
                  description: true,
                })}
                id={fullname.id}
                autoFocus={!!fullname.error}
                required
                className="w-full"
                value={fullnameValue}
                onChange={handleFullnameChange}
              />
              <FormErrors>{fullname}</FormErrors>
            </FormField>
          </div>
          <div className="flex gap-4">
            <FormField className="flex-1">
              <FormLabel htmlFor={country.id}>Country</FormLabel>
              <Select
                {...conform.input(country, {
                  type: "country",
                  description: true,
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="max-h-40 overflow-y-scroll">
                    {countries.map(({ country }) => {
                      return (
                        <SelectItem
                          onClick={() => setCountryValue(country)}
                          key={country}
                          value={country}
                        >
                          <p className="inline-flex items-center gap-2">{country}</p>
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormErrors>{country}</FormErrors>
            </FormField>
            <FormField className="flex-1">
              <FormLabel htmlFor={dateOfBirth.id}>Date of birth</FormLabel>
              <DatePicker className="w-full" name="" />
              <FormErrors>{dateOfBirth}</FormErrors>
            </FormField>
          </div>
          <div className="w-full border-b-2" />
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
        </fieldset>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonLoading
            type="submit"
            loadingText="Submitting..."
            isLoading={isSubmitting}
            variant="default"
            disabled={!isEnabled}
          >
            Create account
          </ButtonLoading>
        </div>
      </Form>
    </p>
  )
}

const useSteps = ({ token, owner }: { token: string; owner?: boolean }) => {
  const [step, stepStep] = useState(0)
  const nextStep = () => stepStep(prevStep => prevStep + 1)
  const prevStep = () => stepStep(prevStep => prevStep - 1)

  const baseSteps = [
    {
      header: "Tell us about you",
      content: <ProfileSetup onNext={nextStep} token={token} />,
      open: true,
    },
    {
      header: "Welcome! 🥳",
      content: <OnboardingIntro nextStep={nextStep} />,
      open: true,
    },
    {
      header: "Pick your password",
      content: (
        <PasswordReset
          description="Lets set your password and keep you safe"
          onNext={nextStep}
          token={token}
        />
      ),
      open: true,
    },
  ]

  const steps = owner
    ? [
        ...baseSteps,
        {
          header: "We're almost done here",
          content: <ProfileSetup token={token} onNext={nextStep} />,
          open: true,
        },
      ]
    : baseSteps

  return { step: steps[step], nextStep, prevStep }
}

const OwnerOnboarding = ({ token }: { token: string }) => {
  const { step } = useSteps({ token, owner: true })
  return <OnboardingDialogSkeleton {...step!} />
}

const OnboardingDialogSkeleton = ({ header, content, open }: TOnboardingDialogSkeletonProps) => {
  return (
    <Dialog open={open}>
      <DialogContent closable={false}>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{content}</DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

const OnboardingDialog = ({ token }: { token: string }) => {
  return <OwnerOnboarding token={token} />
}

export { OnboardingDialog }
