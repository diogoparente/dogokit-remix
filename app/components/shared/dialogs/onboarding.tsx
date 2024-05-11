import { useState, type ReactNode } from "react"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { InputPassword } from "~/components/ui/input-password"

type TOnboardingDialogSkeletonProps = {
  header: string
  content: ReactNode
  open: boolean
}

const useSteps = () => {
  const [step, stepStep] = useState(0)
  const nextStep = () => stepStep(prevStep => prevStep + 1)
  const prevStep = () => stepStep(prevStep => prevStep - 1)

  const OnboardingStep = () => (
    <p className="flex flex-col text-foreground">
      We're so glad to have you onboard! 🥳
      <br /> Let's get started by setting up your account.
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button key="next" onClick={nextStep}>
          Next
        </Button>
      </div>
    </p>
  )

  const PasswordResetForm = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = () => {
      if (password !== confirmPassword) {
        setError("Passwords do not match.")
        return
      }
      setError("")
      nextStep() // Assuming nextStep is in scope, passed via context or props
    }

    return (
      <div className="flex w-full flex-col justify-center gap-4">
        <p className="mb-2">Let's start by resetting your password</p>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <div className="flex w-full max-w-sm flex-col gap-4">
            <InputPassword
              placeholder="Enter new password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="min-w-full max-w-md flex-1"
            />
            <InputPassword
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="min-w-full flex-1"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    )
  }

  const steps = [
    {
      header: "Welcome!",
      content: <OnboardingStep />,
      open: true,
    },
    {
      header: "Password reset",
      content: <PasswordResetForm />,
      open: true,
    },
  ]

  return { step: steps[step], nextStep, prevStep, steps }
}

const OwnerOnboarding = () => {
  const { step } = useSteps()

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

const OnboardingDialog = () => {
  return <OwnerOnboarding />
}

export { OnboardingDialog }
