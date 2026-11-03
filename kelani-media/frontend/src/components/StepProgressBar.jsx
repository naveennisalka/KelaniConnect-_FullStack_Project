import React from 'react';

const StepProgressBar = ({ currentStep = 1, totalSteps = 3 }) => {
  return (
    <div className="w-full max-w-md mx-auto my-4">
      <div className="flex justify-between items-center mb-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  isCurrent
                    ? 'bg-[#800000] text-white'
                    : isCompleted
                    ? 'bg-red-100 text-[#800000]'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>

              {/* Connecting Line */}
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    stepNumber < currentStep ? 'bg-[#800000]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;