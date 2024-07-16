import React from 'react'
import classNames from 'classnames'
import { DayPayload } from '../queries/getDay'

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
  return (
    <div
      className={classNames('h-4 rounded-sm bg-neutral-100 xl:h-6 w-full', props.className)}
    ></div>
  )
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
  label: string
  className?: string
}

function MacroValue(props: MacroValueProps) {
  return (
    <div className="flex flex-col items-center justify-center text-lg font-extrabold leading-6 uppercase">
      <div className="normal-case text-neutral-500">
        {props.value}
        <span className="text-sm">/{props.goal}g</span>
      </div>
      <div className={props.className}>{props.label}</div>
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
          className="text-orange-500"
          goal={day.goals?.foodCarbs ?? 0}
          label="Carbs"
        ></MacroValue>
        <MacroValue
          value={day.foodProtein}
          className="text-blue-500"
          goal={day.goals?.foodProtein ?? 0}
          label="Protein"
        ></MacroValue>
        <MacroValue
          value={day.foodFat}
          className="text-purple-500"
          goal={day.goals?.foodFat ?? 0}
          label="Fat"
        ></MacroValue>
      </div>
    </>
  )
}

export default Macros
