import React from 'react'
import classNames from 'classnames'
import { DayPayload } from '../queries/getDay'
import { GoalType } from 'db'

function calculateMacroPercentages(carbs: number, protein: number, fat: number) {
  // Caloric values per gram
  const caloriesPerGramCarbs = 4
  const caloriesPerGramProtein = 4
  const caloriesPerGramFat = 9

  // Calculate total calories for each macronutrient
  const totalCaloriesCarbs = carbs * caloriesPerGramCarbs
  const totalCaloriesProtein = protein * caloriesPerGramProtein
  const totalCaloriesFat = fat * caloriesPerGramFat

  // Calculate total caloric intake
  const totalCalories = totalCaloriesCarbs + totalCaloriesProtein + totalCaloriesFat

  // Calculate percentage of total calories for each macronutrient
  const carbsPercentage = (totalCaloriesCarbs / totalCalories) * 100
  const proteinPercentage = (totalCaloriesProtein / totalCalories) * 100
  const fatPercentage = (totalCaloriesFat / totalCalories) * 100

  return {
    carbsPercentage: Number(carbsPercentage.toFixed(2)),
    proteinPercentage: Number(proteinPercentage.toFixed(2)),
    fatPercentage: Number(fatPercentage.toFixed(2)),
  }
}

type ProgressBarProps = {
  className?: string | string[]
}

function ProgressBar(props: ProgressBarProps) {
  return <div className={classNames('h-1 rounded-sm xl:h-2 w-full', props.className)}></div>
}

type MacroContainerProps = {
  children: React.ReactNode
  width: number
}

function MacroContainer(props: MacroContainerProps) {
  const { children, width } = props

  return (
    <div
      className="flex px-px transition-all duration-1000 ease-out"
      style={{ width: `${Math.min(width || 0.001, 100)}%` }}
    >
      {children}
    </div>
  )
}

type MacroValueProps = {
  value: number
  goal: number
  goalType: GoalType
  children: React.ReactNode
  className?: string
}

function MacroValue(props: MacroValueProps) {
  let score = 0
  if (props.goalType === 'CEILING') {
    score = props.value / props.goal
  }

  if (props.goalType === 'FLOOR') {
    score = props.goal / props.value
  }

  return (
    <div className="flex flex-col items-center justify-center text-lg font-extrabold leading-6 uppercase">
      <div
        className={classNames('normal-case', {
          'text-emerald-500': score <= 1,
          'text-yellow-500': score > 1 && score <= 1.2,
          'text-red-500': score > 1.2 && score <= 1.35,
          'text-red-700': score >= 1.35,
        })}
      >
        {props.value}
        <span className="text-sm text-neutral-500">/{props.goal}g</span>
      </div>
      <div className={classNames('text-sm text-neutral-500', props.className)}>
        {props.children}
      </div>
    </div>
  )
}

type MacrosProps = {
  day: DayPayload
}

function Macros(props: MacrosProps) {
  const { day } = props

  const totalMacros = calculateMacroPercentages(day.foodCarbs, day.foodProtein, day.foodFat)

  return (
    <>
      <div className="flex -mx-px">
        <MacroContainer width={totalMacros.carbsPercentage}>
          <ProgressBar className={'bg-orange-500'} />
        </MacroContainer>
        <MacroContainer width={totalMacros.proteinPercentage}>
          <ProgressBar className={'bg-blue-500'} />
        </MacroContainer>
        <MacroContainer width={totalMacros.fatPercentage}>
          <ProgressBar className={'bg-purple-500'} />
        </MacroContainer>
      </div>
      <div className="flex justify-around">
        <MacroValue
          value={day.foodCarbs}
          goal={day.goals?.foodCarbs ?? 0}
          goalType={day.goals?.foodCarbsType ?? 'CEILING'}
        >
          <h2 className="flex items-center space-x-1">
            <span>Carbs</span>
            <span className="inline-block w-3 h-3 text-xs bg-orange-500 rounded-sm"></span>
          </h2>
        </MacroValue>
        <MacroValue
          value={day.foodProtein}
          goal={day.goals?.foodProtein ?? 0}
          goalType={day.goals?.foodProteinType ?? 'FLOOR'}
        >
          <h2 className="flex items-center space-x-1">
            <span>Protein</span>
            <span className="inline-block w-3 h-3 text-xs bg-blue-500 rounded-sm"></span>
          </h2>
        </MacroValue>
        <MacroValue
          value={day.foodFat}
          goal={day.goals?.foodFat ?? 0}
          goalType={day.goals?.foodFatType ?? 'CEILING'}
        >
          <h2 className="flex items-center space-x-1 text-xs">
            <span>Fat</span>
            <span className="inline-block w-3 h-3 bg-purple-500 rounded-sm"></span>
          </h2>
        </MacroValue>
      </div>
    </>
  )
}

export default Macros
