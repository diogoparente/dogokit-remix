import { useState, type ReactNode } from "react"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

import { PasswordReset } from "../forms/password-reset"

type TOnboardingDialogSkeletonProps = {
  header: string
  content: ReactNode
  open: boolean
}

const useSteps = ({ token, owner }: { token: string; owner?: boolean }) => {
  const [step, stepStep] = useState(0)
  const nextStep = () => stepStep(prevStep => prevStep + 1)
  const prevStep = () => stepStep(prevStep => prevStep - 1)

  const OnboardingStep = () => (
    <p className="flex flex-col text-foreground">
      We're so glad to have you onboard!
      <br /> Let's get started by setting up your account.
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button key="next" onClick={nextStep}>
          Next
        </Button>
      </div>
    </p>
  )

  const baseSteps = [
    {
      header: "Welcome! 🥳",
      content: <OnboardingStep />,
      open: true,
    },
    {
      header: "Password reset 🔐",
      content: (
        <PasswordReset
          description="First of all, lets set your password, and keep you safe"
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
          header: "Company setup",
          content: <div>hello world</div>,
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
