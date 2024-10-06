import classNames from 'classnames'
import { DayPayload } from 'src/day/queries/getDay'
import { getCaloriesGoalType } from 'src/fitnessMetrics/calorieDeficit'

type CurrentWeightProps = {
  bodyMetrics?: DayPayload['bodyMetrics'] | null
  deficitType?: ReturnType<typeof getCaloriesGoalType>
}

function CurrentWeight(props: CurrentWeightProps) {
  if (props.bodyMetrics) {
    const { weightInKilograms, weightDelta } = props.bodyMetrics

    return (
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-600">
          {weightInKilograms}
          <span className="text-xl">kg</span>
          {weightDelta && weightDelta != 0 && (
            <span
              className={classNames('ml-1 text-sm text-neutral-500', {
                '!text-green-600':
                  (props.deficitType === 'DEFICIT' && weightDelta < 0) ||
                  (props.deficitType === 'SUPERAVIT' && weightDelta > 0),
              })}
            >
              ({weightDelta > 0 && '+'}
              {weightDelta.toFixed(1)})
            </span>
          )}
        </h1>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <h1 className="text-sm font-extrabold text-center uppercase text-neutral-600">No Data</h1>
      <div>
        <button type="button" className="block w-auto mx-auto mt-1 text-white bg-teal-700 button">
          Log Weight
        </button>
      </div>
    </div>
  )
}

export default CurrentWeight
