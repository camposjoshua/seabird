type StepperProps = {
  currentStep: number;
  steps: string[];
};

export const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="flex w-full items-start">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompleted =
          index < currentStep || (isLast && index === currentStep);
        const isActive = index === currentStep && !isLast;

        return (
          <div key={step} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "border-blue-600 bg-blue-600 text-white"
                    : isActive
                      ? "border-blue-600 bg-primary/10 text-blue-600"
                      : "border-default-300 bg-default-100 text-default-400"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              <span
                className={`whitespace-nowrap text-xs sm:text-sm ${
                  isActive
                    ? "font-semibold text-blue-600"
                    : isCompleted
                      ? "text-primary"
                      : "text-default-400"
                }`}
              >
                {step}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div className="mx-2 mt-[17px] h-0.5 flex-1 rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    index < currentStep ? "w-full bg-blue-600" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
