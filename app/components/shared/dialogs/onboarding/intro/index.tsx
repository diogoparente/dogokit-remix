import { Button } from "~/components/ui/button"

const OnboardingIntro = ({ onNext }: { onNext: () => void }) => (
  <p className="flex flex-col">
    <p className="min-h-16 max-w-[370px] text-sm">
      We're so glad to have you onboard! Let's get started by setting up your account.
    </p>
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button key="next" onClick={onNext}>
        Next
      </Button>
    </div>
  </p>
)

export { OnboardingIntro }
