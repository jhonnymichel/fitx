import { useState, useRef } from 'react'
import classNames from 'classnames'

export type Prefix = 'transition' | 'transition-vertical'

export const transitionDuration: { [key in Prefix]: number } = {
  transition: 200,
  'transition-vertical': 200,
}

function useStepTransition<TStep = number>(
  step: TStep,
  prefix: Prefix = 'transition',
  getIsForward: (currentStep: TStep, nextStep: TStep) => boolean = (c, n) => n > c
): [TStep, string, (nextStep: TStep) => void] {
  const lastStep = useRef<TStep | null>()
  const [currentStep, setCurrentStep] = useState(step)
  const [animationClassNames, setAnimationClassNames] = useState(classNames('transition-next'))

  const updateStep = (nextStep: TStep) => {
    const isForward = getIsForward(currentStep, nextStep)
    lastStep.current = currentStep
    setAnimationClassNames(
      classNames({
        [`${prefix}-next`]: isForward,
        [`${prefix}-prev`]: !isForward,
      })
    )

    requestAnimationFrame(() => {
      setCurrentStep(nextStep)
    })
  }

  return [currentStep, animationClassNames, updateStep]
}

export default useStepTransition
