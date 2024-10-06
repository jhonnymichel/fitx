import React from 'react'
import classNames from 'classnames'
import { DayPayload } from '../queries/getDay'
import { GoalType } from 'db'
import { calculateMacroPercentages, ParsedMacro, parseMacros } from 'src/fitnessMetrics/macros'

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
  macro: ParsedMacro
  children: React.ReactNode
  className?: string
}

function MacroValue(props: MacroValueProps) {
  const { score, value, goal } = props.macro

  return (
    <div className="flex flex-col items-center justify-center text-lg font-extrabold leading-6 uppercase">
      <div
        className={classNames('normal-case', {
          'text-emerald-500': score <= 1,
          'text-emerald-400': score > 1 && score <= 1.15,
          'text-yellow-500': score > 1.15 && score <= 1.3,
          'text-red-500': score > 1.3 && score <= 1.45,
          'text-red-700': score >= 1.45,
        })}
      >
        {value}
        <span className="text-sm text-neutral-500">/{goal}g</span>
      </div>
      <div className={classNames('text-sm text-neutral-500', props.className)}>
        {props.children}
      </div>
    </div>
  )
}

type MacrosProps = {
  day: NonNullable<DayPayload['day']>
}

function Macros(props: MacrosProps) {
  const { day } = props

  const totalMacros = calculateMacroPercentages(day.foodCarbs, day.foodProtein, day.foodFat)

  const macros = parseMacros({
    foodCarbs: day.foodCarbs,
    foodProtein: day.foodProtein,
    foodFat: day.foodFat,
    goals: day.goals,
  })

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
        <MacroValue macro={macros.carbs}>
          <h2 className="flex items-center space-x-1">
            <span>Carbs</span>
            <span className="inline-block w-3 h-3 text-xs bg-orange-500 rounded-sm"></span>
          </h2>
        </MacroValue>
        <MacroValue macro={macros.protein}>
          <h2 className="flex items-center space-x-1">
            <span>Protein</span>
            <span className="inline-block w-3 h-3 text-xs bg-blue-500 rounded-sm"></span>
          </h2>
        </MacroValue>
        <MacroValue macro={macros.fat}>
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
