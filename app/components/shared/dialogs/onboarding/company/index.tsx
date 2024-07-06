import { Form } from "@remix-run/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { ButtonLoading } from "~/components/ui/button-loading"
import { FormField, FormLabel } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import countries from "~/utils/countries"

interface CompanySetupForm {
  name: string
  location: string
}

interface CompanySetupProps {
  onNext: () => void
  token: string
}

const CompanySetup: React.FC<CompanySetupProps> = ({ onNext, token }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { watch, setValue } = useForm<CompanySetupForm>({
    defaultValues: {
      name: "",
      location: "",
    },
    mode: "onChange",
  })

  const name = watch("name")
  const location = watch("location")

  useEffect(() => {
    if (name && location) {
      setIsEnabled(true)
    } else {
      setIsEnabled(false)
    }
  }, [name, location])

  // run validations
  const onValidate = () => {
    return true
  }

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission

    if (onValidate()) {
      const formData = new FormData(event.currentTarget)

      formData.append("token", token)
      formData.append("name", name)
      formData.append("location", location)

      try {
        setIsSubmitting(true)
        const response = await fetch("/auth/company-setup", {
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
      <p className="mb-4 text-sm">Fill your company's details (you can change it later)</p>
      <Form className="flex flex-col gap-2" onSubmit={onHandleSubmit}>
        <fieldset className="mb-4 flex flex-col gap-4">
          <div className="flex gap-4">
            <FormField className="flex-1">
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                autoCapitalize="true"
                id="name"
                required
                className="w-full"
                onChange={e => setValue("name", e.target.value)}
              />
            </FormField>
            <FormField className="flex-1">
              <FormLabel htmlFor="country">Location</FormLabel>
              <Select onValueChange={value => setValue("location", value)} required>
                <SelectTrigger value={location}>
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
          </div>
        </fieldset>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonLoading
            type="submit"
            loadingText="Submitting..."
            isLoading={isSubmitting}
            variant="default"
            disabled={!isEnabled}
          >
            Create company
          </ButtonLoading>
        </div>
      </Form>
    </div>
  )
}

export { CompanySetup }
