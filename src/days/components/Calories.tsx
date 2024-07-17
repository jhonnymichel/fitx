import { useEffect, useState } from 'react'
import { DayPayload } from '../queries/getDay'
import classNames from 'classnames'
import * as Icons from 'src/components/icons'

function ProgressBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(score * 100)
  }, [score])

  return (
    <div
      className={classNames('h-2 transition-all duration-1000 ease-out rounded-md ', {
        'bg-emerald-500': score <= 1,
        'bg-yellow-500': score > 1 && score <= 1.2,
        'bg-red-500': score > 1.2 && score <= 1.35,
        'bg-red-700': score >= 1.35,
      })}
      style={{ width: `${Math.min(width || 0.001, 100)}%` }}
    ></div>
  )
}

type CaloriesProps = {
  day: DayPayload
}

function Calories(props: CaloriesProps) {
  const score = props.day.foodCalories / (props.day.goals?.foodCalories ?? 2300)

  return (
    <div className="flex items-center justify-between space-x-5">
      <div className="shrink-0">
        <Icons.Food className="!w-12 !h-12" />
      </div>
      <div className="flex flex-col items-end w-full">
        <ProgressBar score={score} />
        <div className="flex justify-between w-full space-x-2">
          <h1
            className={classNames('text-2xl font-extrabold', {
              'text-emerald-500': score <= 1,
              'text-yellow-500': score > 1 && score <= 1.2,
              'text-red-500': score > 1.2 && score <= 1.35,
              'text-red-700': score >= 1.35,
            })}
          >
            {props.day.foodCalories}
            <span className="text-sm text-neutral-500">/{props.day.goals?.foodCalories} kcal.</span>
          </h1>
          <p className="font-bold text-md text-neutral-500">
            {(props.day.goals?.foodCalories ?? 2300) - props.day.foodCalories} left
          </p>
        </div>
      </div>
    </div>
  )
}

export default Calories
