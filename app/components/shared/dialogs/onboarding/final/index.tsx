import { Button } from "~/components/ui/button"

const OnboardingFinal = ({ onNext }: { onNext: () => void }) => (
  <p className="flex flex-col">
    <p className="min-h-16 max-w-[370px] text-sm">
      We're done with your setup. You can now close this dialog.
    </p>
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button key="next" onClick={onNext}>
        Finish
      </Button>
    </div>
  </p>
)

export { OnboardingFinal }
