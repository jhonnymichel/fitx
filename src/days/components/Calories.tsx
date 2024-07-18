import { useEffect, useState } from 'react'
import { DayPayload } from '../queries/getDay'
import classNames from 'classnames'
import * as Icons from 'src/components/icons'

function ProgressBar({ score, width }: { score: number; width: number }) {
  const cssWidth = width * 100

  return (
    <div
      className={classNames('h-2 transition-all duration-1000 ease-out rounded-md ', {
        'bg-emerald-500': score <= 1,
        'bg-emerald-400': score > 1 && score <= 1.15,
        'bg-yellow-500': score > 1.15 && score <= 1.3,
        'bg-red-500': score > 1.3 && score <= 1.45,
        'bg-red-700': score > 1.45,
      })}
      style={{ width: `${Math.min(cssWidth || 0.001, 100)}%` }}
    ></div>
  )
}

type CaloriesProps = {
  day: DayPayload
}

function Calories(props: CaloriesProps) {
  const goalType = props.day.goals?.foodCaloriesType ?? 'CEILING'
  const goal = props.day.goals?.foodCalories ?? 2300

  let score = 0

  if (goalType === 'CEILING') {
    score = props.day.foodCalories / goal
  }

  if (goalType === 'FLOOR') {
    score = goal / props.day.foodCalories
  }

  console.log(score)

  return (
    <div className="flex items-center justify-between space-x-5">
      <div className="shrink-0">
        <Icons.Food className="!w-12 !h-12" />
      </div>
      <div className="flex flex-col items-end w-full">
        <ProgressBar score={score} width={props.day.foodCalories / goal} />
        <div className="flex justify-between w-full space-x-2">
          <h1
            className={classNames('text-2xl font-extrabold', {
              'text-emerald-500': score <= 1,
              'text-emerald-400': score > 1 && score <= 1.15,
              'text-yellow-500': score > 1.15 && score <= 1.3,
              'text-red-500': score > 1.3 && score <= 1.45,
              'text-red-700': score > 1.45,
            })}
          >
            {props.day.foodCalories}
            <span className="text-sm text-neutral-500">/{goal} kcal.</span>
          </h1>
          {goalType === 'CEILING' && (
            <p className="font-bold text-md text-neutral-500">
              {goal - props.day.foodCalories} left
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calories
