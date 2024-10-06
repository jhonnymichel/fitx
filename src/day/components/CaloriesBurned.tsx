import { DayPayload } from '../queries/getDay'
import classNames from 'classnames'
import * as Icons from 'src/core/components/icons'

type CaloriesBurnedProps = {
  day: NonNullable<DayPayload['day']>
}

function CaloriesBurned(props: CaloriesBurnedProps) {
  const goal = props.day.goals?.caloriesBurned ?? 3000
  const goalType = props.day.goals?.caloriesBurnedType ?? 'FLOOR'
  let score = props.day.caloriesBurned / goal
  if (goalType === 'CEILING') {
    score = goal / props.day?.caloriesBurned
  }

  return (
    <div className="flex items-center justify-between space-x-3">
      <div className="flex flex-col items-end w-full">
        <div className="flex justify-between w-full space-x-2">
          <p
            className={classNames('text-2xl font-extrabold', {
              'text-emerald-500': score >= 1,
              'text-emerald-400': score < 1 && score >= 0.85,
              'text-yellow-500': score < 0.85 && score >= 0.7,
              'text-red-500': score < 0.5 && score >= 0.65,
              'text-red-700': score < 0.65,
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
