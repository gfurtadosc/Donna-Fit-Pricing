interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function WizardProgress({
  currentStep,
  totalSteps,
}: WizardProgressProps) {
  return (
    <div className="mb-5 flex gap-1.5" aria-hidden="true">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`h-1.5 flex-1 rounded-full ${
            index < currentStep ? "bg-clay" : "bg-sand"
          }`}
        />
      ))}
    </div>
  );
}
