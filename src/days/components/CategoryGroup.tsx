import { useEffect, useState } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useFormikContext } from 'formik'
import useStepTransition, { transitionDuration } from 'src/hooks/useStepTransition'
import { fix } from 'src/days/getScore'

function ProgressBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth((score / 10) * 100)
  }, [score])

  return (
    <div
      className="h-4 transition-all duration-1000 ease-out bg-gray-200 rounded-md xl:h-6"
      style={{ width: `${Math.min(width || 0.001, 100)}%` }}
    ></div>
  )
}

function LoadingTitle() {
  return (
    <div className="ph-item">
      <div className="flex flex-col justify-end w-full h-full space-y-1">
        <div className="space-y-1 ph-row">
          <div className="ph-col-4" style={{ height: '1rem' }}></div>
        </div>
      </div>
    </div>
  )
}

type CategoryGroupProps = {
  icon: React.ReactNode
  score: number
  isLoading?: boolean
  title: string
  details: string | null | undefined
  children: React.ReactNode
  noData: boolean
}

function CategoryGroup(props: CategoryGroupProps) {
  const { icon, score, isLoading, title, details, children, noData } = props

  const [isEditing, animationClassNames, setIsEditing] = useStepTransition(
    Number(false),
    'transition-vertical'
  )

  return (
    <div className="flex flex-shrink-0 h-16 space-x-2 overflow-hidden xl:space-x-4 xl:h-20">
      <div className="flex-shrink-0">{icon}</div>
      <SwitchTransition>
        <CSSTransition
          key={isEditing}
          classNames={animationClassNames}
          timeout={transitionDuration['transition-vertical']}
        >
          {isEditing ? (
            <div className="flex flex-1 space-x-2 xl:space-x-4">
              <div className="flex flex-col justify-center flex-1">{children}</div>
              <div className="flex flex-col flex-shrink-0 space-y-1 xl:space-y-2">
                <button
                  type="submit"
                  onClick={() => {
                    setIsEditing(Number(false))
                  }}
                  className="text-sm text-teal-900 bg-teal-500 text-bold button hover:bg-teal-600"
                >
                  OK
                </button>
                <button
                  type="button"
                  className="text-sm text-orange-900 bg-orange-500 text-bold button hover:bg-orange-600"
                  onClick={() => setIsEditing(Number(false))}
                >
                  X
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full min-w-0 space-y-2 xl:space-y-4">
              <ProgressBar score={score} />
              <div className="flex justify-between space-y-1 xl:space-x-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold uppercase xl:text-base">{title}</h2>
                  {isLoading ? (
                    <LoadingTitle />
                  ) : (
                    <p className="text-xs font-semibold text-gray-400 uppercase truncate xl:text-sm">
                      {details}
                    </p>
                  )}
                </div>
                <div className="flex items-end flex-shrink-0 space-x-2">
                  {!isLoading && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(Number(true))
                        }}
                      >
                        {noData ? 'Add' : 'Edit'}
                      </button>
                      {!noData && (
                        <p className="text-4xl font-semibold">{Math.min(10, fix(score))}</p>
                      )}
                    </>
                  )}
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
