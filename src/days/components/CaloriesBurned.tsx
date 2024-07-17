import { DayPayload } from '../queries/getDay'
import classNames from 'classnames'
import * as Icons from 'src/components/icons'

type CaloriesBurnedProps = {
  day: DayPayload
}

function CaloriesBurned(props: CaloriesBurnedProps) {
  const score = props.day.caloriesBurned / (props.day.goals?.caloriesBurned ?? 3000)

  return (
    <div className="flex items-center justify-between space-x-3">
      <div className="flex flex-col items-end w-full">
        <div className="flex justify-between w-full space-x-2">
          <p
            className={classNames('text-2xl font-extrabold', {
              'text-emerald-500': score >= 1,
              'text-emerald-300': score < 1 && score >= 0.9,
              'text-yellow-500': score < 0.9 && score >= 0.66,
              'text-red-700': score < 0.66,
            })}
          >
            {props.day.caloriesBurned}
            <span className="text-sm text-neutral-500">
              /{props.day.goals?.caloriesBurned} kcal.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaloriesBurned
