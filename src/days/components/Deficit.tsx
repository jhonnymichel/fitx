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
      className={classNames('h-4 transition-all duration-1000 ease-out rounded-md xl:h-6', {
        'bg-green-500': score <= 1,
        'bg-yellow-500': score > 1 && score <= 1.2,
        'bg-red-500': score > 1.2 && score <= 1.35,
        'bg-red-700': score >= 1.35,
      })}
      style={{ width: `${Math.min(width || 0.001, 100)}%` }}
    ></div>
  )
}

type DeficitProps = {
  day: DayPayload
}

function Deficit(props: DeficitProps) {
  return (
    <div className="flex justify-between space-x-10">
      <div className="shrink-0">
        <Icons.Cardio />
      </div>
      <div className="flex flex-col items-end w-full">
        <ProgressBar score={props.day.caloriesBurned / (props.day.goals?.foodCalories ?? 2300)} />
        <div className="flex justify-between w-full space-x-2">
          <h1 className="text-2xl font-extrabold text-neutral-500">
            {props.day.foodCalories}
            <span className="text-lg">/{props.day.goals?.foodCalories} kcal.</span>
          </h1>
          <p className="font-bold text-md text-neutral-500">
            {(props.day.goals?.foodCalories ?? 2300) - props.day.foodCalories} left
          </p>
        </div>
      </div>
    </div>
  )
}

export default Deficit
