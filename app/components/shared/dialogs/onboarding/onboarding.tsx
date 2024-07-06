import { useNavigate } from "@remix-run/react"
import { useEffect, useState, type ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

import { CompanySetup } from "./company"
import { OnboardingFinal } from "./final"
import { OnboardingIntro } from "./intro"
import { ProfileSetup } from "./profile"

type TOnboardingDialogSkeletonProps = {
  header: string
  content: ReactNode
  open: boolean
}

const useSteps = ({
  token,
  isAdmin,
  isOnboarded,
  isCompanyCreated,
}: {
  token: string
  isAdmin: boolean
  isOnboarded: boolean
  isCompanyCreated: boolean
}) => {
  const navigate = useNavigate()
  const [step, stepStep] = useState(0)
  const nextStep = () => stepStep(prevStep => prevStep + 1)
  const prevStep = () => stepStep(prevStep => prevStep - 1)

  const onFinish = () => {
    navigate("/home", { state: { key: "welcome" } })
  }

  useEffect(() => {
    if (isOnboarded) {
      navigate("/home")
    }
  }, [isAdmin, isOnboarded, navigate])

  const welcomeStep = {
    header: "Welcome! 🥳",
    content: <OnboardingIntro onNext={nextStep} />,
    open: true,
  }

  const profileStep = {
    header: "Tell us about you",
    content: <ProfileSetup onNext={nextStep} token={token} />,
    open: true,
  }

  const finalStep = {
    header: "Setup complete 🎉",
    content: <OnboardingFinal onNext={onFinish} />,
    open: true,
  }

  const baseSteps = isAdmin
    ? [
        welcomeStep,
        isOnboarded ? null : profileStep,
        isCompanyCreated
          ? null
          : {
              header: "We're almost done here",
              content: <CompanySetup token={token} onNext={nextStep} />,
              open: true,
            },
        finalStep,
      ]
    : [welcomeStep, isOnboarded ? null : profileStep, finalStep]

  const steps = baseSteps.filter(step => step !== null)
  return { step: steps[step], nextStep, prevStep }
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

const OnboardingDialog = ({
  token,
  isAdmin,
  isOnboarded,
  isCompanyCreated,
}: {
  token: string
  isAdmin: boolean
  isOnboarded: boolean
  isCompanyCreated: boolean
}) => {
  const { step } = useSteps({ token, isAdmin, isOnboarded, isCompanyCreated })
  return <OnboardingDialogSkeleton {...step!} />
}

export { OnboardingDialog }
