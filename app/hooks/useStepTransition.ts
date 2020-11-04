import { useState, useRef } from 'react'
import classNames from 'classnames'

type UpdateStep = (nextStep: number) => void

export type Prefix = 'transition' | 'transition-vertical'

export const transitionDuration: { [key in Prefix]: number } = {
  transition: 200,
  'transition-vertical': 200,
}

function useStepTransition(
  step: number,
  prefix: Prefix = 'transition'
): [number, string, UpdateStep] {
  const lastStep = useRef<number | null>()
  const [currentStep, setCurrentStep] = useState(step)
  const [animationClassNames, setAnimationClassNames] = useState(classNames('transition-next'))

  const updateStep: UpdateStep = (nextStep) => {
    lastStep.current = currentStep
    setAnimationClassNames(
      classNames({
        [`${prefix}-next`]: nextStep > currentStep,
        [`${prefix}-prev`]: nextStep < currentStep,
      })
    )

    requestAnimationFrame(() => {
      setCurrentStep(nextStep)
    })
  }

  return [currentStep, animationClassNames, updateStep]
}

export default useStepTransition
