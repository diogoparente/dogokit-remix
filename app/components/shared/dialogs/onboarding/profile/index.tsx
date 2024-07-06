import { Form } from "@remix-run/react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { ButtonLoading } from "~/components/ui/button-loading"
import { DatePicker } from "~/components/ui/date-picker"
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
import countries from "~/utils/countries"

interface UserProfileSetupForm {
  fullname: string
  country: string
  dateOfBirth: Date
  password: string
  confirmPassword: string
}

interface ProfileSetupProps {
  onNext: () => void
  token: string
}

const currentDate = new Date()

const toYear = currentDate.getFullYear() - 18
const defaultDateOfBirth = new Date(
  toYear,
  currentDate.getMonth(),
  currentDate.getDate(),
  0,
  0,
  0,
  0,
)
const ProfileSetup: React.FC<ProfileSetupProps> = ({ onNext, token }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, watch, setValue, setError } = useForm<UserProfileSetupForm>({
    defaultValues: {
      fullname: "",
      country: "",
      dateOfBirth: defaultDateOfBirth,
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const fullname = watch("fullname")
  const country = watch("country")
  const dateOfBirth = watch("dateOfBirth")
  const password = watch("password")
  const confirmPassword = watch("confirmPassword")

  useEffect(() => {
    console.log({ fullname })

    if (fullname && country && dateOfBirth && password && confirmPassword) {
      setIsEnabled(true)
    } else {
      setIsEnabled(false)
    }
  }, [fullname, country, dateOfBirth, password, confirmPassword])

  // run validations
  const onValidate = () => {
    if (password !== confirmPassword) {
      setError("password", { message: "Passwords do match" }, { shouldFocus: true })
      return false
    }
    return true
  }

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission

    if (onValidate()) {
      const formData = new FormData(event.currentTarget)
      formData.append("token", token)
      formData.append("fullname", fullname)
      formData.append("country", country)
      formData.append("dateOfBirth", dateOfBirth.toDateString())
      formData.append("password", password)
      formData.append("confirmPassword", confirmPassword)

      try {
        setIsSubmitting(true)
        const response = await fetch("/auth/profile-setup", {
          method: "POST",
          body: formData,
        })

        await response.json()

        if (response.ok) {
          setIsSubmitting(false)
          onNext && onNext()
        } else {
          setIsSubmitting(false)
        }
      } catch (error) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="flex grow flex-col text-foreground">
      <p className="mb-4 text-sm">
        Enter your details below to create your account and get started
      </p>
      <Form className="flex flex-col gap-2" onSubmit={onHandleSubmit}>
        <fieldset className="mb-4 flex flex-col gap-4">
          <div className="flex gap-4">
            <FormField className="flex-1">
              <FormLabel htmlFor="fullname">Full name</FormLabel>
              <Input
                autoCapitalize="true"
                id="fullname"
                required
                className="w-full"
                onChange={e => setValue("fullname", e.target.value)}
                // onInput={e => {
                //   const {
                //     target: { value },
                //   } = e as React.ChangeEvent<HTMLInputElement>
                //   console.log({ value })

                //   setValue("fullname", value)
                // }}
              />
            </FormField>
          </div>
          <div className="flex gap-4">
            <FormField className="flex-1">
              <FormLabel htmlFor="country">Country</FormLabel>
              <Select onValueChange={value => setValue("country", value)} required>
                <SelectTrigger value={country}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="max-h-40 overflow-y-scroll">
                    {countries.map(({ country }) => (
                      <SelectItem key={country} value={country}>
                        <p className="inline-flex items-center gap-2">{country}</p>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormField>
            <FormField className="flex-1">
              <FormLabel htmlFor="dateOfBirth">Date of birth</FormLabel>
              <DatePicker
                name="dateOfBirth"
                id="dateOfBirth"
                className="w-full"
                defaultValue={defaultDateOfBirth.toDateString()}
                onChange={date => setValue("dateOfBirth", date)}
                yearPast={80}
                toYear={toYear}
                yearFuture={0}
              />
            </FormField>
          </div>
          <div className="w-full border-b-2" />
          <FormField>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputPassword
              required
              className="w-full"
              onChange={e => setValue("password", e.target.value)}
            />
            <FormErrors children={{ name: "password", error: password }} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
            <InputPassword
              {...register("confirmPassword", { required: true })}
              required
              className="w-full"
              onChange={e => setValue("confirmPassword", e.target.value)}
            />
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
    </div>
  )
}

export { ProfileSetup }
