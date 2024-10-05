import { parseCalorieDeficit } from 'src/fitnessMetrics/calorieDeficit'
import { DayPayload } from '../queries/getDay'
import classNames from 'classnames'

type CalorieDeficitProps = {
  day: NonNullable<DayPayload['day']>
}

function CalorieDeficit(props: CalorieDeficitProps) {
  const { caloriesBurned, foodCalories, goals } = props.day
  const { deficit, score, goal } = parseCalorieDeficit({ caloriesBurned, foodCalories, goals })

  return (
    <div className="flex items-center justify-between space-x-3">
      <div className="flex flex-col items-end w-full">
        <div className="flex justify-between w-full space-x-2">
          <p
            className={classNames('text-2xl font-extrabold', {
              'text-emerald-500': deficit >= goal,
              'text-emerald-400': deficit > 0 && score >= 0.66 && score < 1,
              'text-yellow-500': deficit > 0 && score < 0.66,
              'text-red-700': deficit < 0,
            })}
          >
            {deficit}
            <span className="text-sm text-neutral-500">/{goal} kcal.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CalorieDeficit
