import { useEffect, useRef, useState } from 'react'
import { fix } from '../get-score'
import useStepTransition, { transitionDuration } from 'app/hooks/useStepTransition'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useFormikContext } from 'formik'

function ProgressBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth((score / 10) * 100)
  }, [score])

  return (
    <div
      className="h-6 transition-all duration-1000 ease-out bg-gray-200 rounded-md"
      style={{ width: `${Math.min(width || 0.001, 100)}%` }}
    ></div>
  )
}

type CategoryGroupProps = {
  icon: React.ReactNode
  score: number
  title: string
  details: string | null | undefined
  children: React.ReactNode
}

function CategoryGroup({ icon, score, title, details, children }: CategoryGroupProps) {
  const localSubmitStatus = useRef<'initial' | 'trigered' | 'submiting'>('initial')

  const { isSubmitting } = useFormikContext()

  const [isEditing, animationClassNames, setIsEditing] = useStepTransition(
    Number(false),
    'transition-vertical'
  )

  useEffect(() => {
    if (isSubmitting && localSubmitStatus.current === 'trigered') {
      localSubmitStatus.current = 'submiting'
    }

    if (!isSubmitting && localSubmitStatus.current === 'submiting') {
      localSubmitStatus.current = 'initial'
      setIsEditing(Number(false))
    }
  }, [isSubmitting, setIsEditing])

  return (
    <div className="flex h-20 space-x-4 overflow-hidden">
      <div className="flex-shrink-0">{icon}</div>
      <SwitchTransition>
        <CSSTransition
          key={isEditing}
          classNames={animationClassNames}
          timeout={transitionDuration['transition-vertical']}
        >
          {isEditing ? (
            <div className="flex flex-1 space-x-1">
              <div className="flex-1">{children}</div>
              <div className="flex flex-col flex-shrink-0 space-y-2">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  onClick={() => {
                    localSubmitStatus.current = 'trigered'
                  }}
                  className="text-teal-900 bg-teal-500 text-bold button hover:bg-teal-600"
                >
                  OK
                </button>
                <button
                  disabled={isSubmitting}
                  type="button"
                  className="text-orange-900 bg-orange-500 text-bold button hover:bg-orange-600"
                  onClick={() => setIsEditing(Number(false))}
                >
                  X
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full min-w-0 space-y-2 lg:space-y-4">
              <ProgressBar score={score} />
              <div className="flex justify-between space-x-2">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold uppercase">{title}</h2>
                  <p className="text-sm font-semibold text-gray-400 uppercase truncate">
                    {details}
                  </p>
                </div>
                <div className="flex items-end flex-shrink-0 space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(Number(true))
                    }}
                  >
                    {score > 0 ? 'Edit' : 'Add'}
                  </button>
                  {score > 0 && <p className="text-4xl font-semibold">{fix(score)}</p>}
                </div>
              </div>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export default CategoryGroup
