import { Day } from 'db'
import * as Icons from 'app/components/icons'
import { useEffect, useState } from 'react'
import OverallScore from 'app/components/OverallScore'
import getDayScore, { getCardioScore, getFoodScore, getStrengthScore } from '../get-score'
import Form from 'app/components/Form'

function ProgressBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth((score / 10) * 100)
  }, [score])

  return (
    <div
      className="h-6 transition-all duration-1000 ease-out bg-gray-200 rounded-md"
      style={{ width: `${width}%` }}
    ></div>
  )
}

type CategoryGroupProps = {
  icon: React.ReactNode
  score: number
  title: string
  details: string | null | undefined
  children: React.ReactNode
}

function CategoryGroup({ icon, score, title, details, children }: CategoryGroupProps) {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0">{icon}</div>
      {isEditing ? (
        <div className="flex flex-1 space-x-1">
          <div className="flex-1">{children}</div>
          <div className="flex flex-col flex-shrink-0">
            <button type="submit">OK</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              X
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-2 lg:space-y-4">
          <ProgressBar score={score} />
          <div className="flex justify-between space-x-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold uppercase">{title}</h2>
              <p className="text-sm font-semibold text-gray-400 uppercase truncate">{details}</p>
            </div>
            <div className="flex items-end flex-shrink-0 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true)
                }}
              >
                Add
              </button>
              {score > 0 && <p className="text-4xl font-semibold">{score}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function LoadingDaySummary() {
  return <>Loading</>
}

function getDayScoreComment(score) {
  if (score === 0) {
    return 'Is this even possible?'
  }

  if (score <= 5) {
    return 'Come on now. Are you even trying?'
  }

  if (score <= 6) {
    return "Just ok. And to be honest, I'm only being nice."
  }

  if (score <= 7) {
    return 'Good job, but you know you can push further!'
  }

  if (score <= 8) {
    return "Oh my god you're gonna get so hot!"
  }

  if (score <= 9) {
    return `This is almost inhuman. That's how much effort you're putting!`
  }

  return 'You are the FITNESS MASTER'
}

function FoodEditMode() {
  return <div>edit</div>
}

function CardioEditMode() {
  return <div>edit</div>
}

function StrengthEditMode() {
  return <div>edit</div>
}

function DaySummary({ day }: { day?: Day }) {
  const { foodCalories, cardioCount, cardioType, strengthDone, strengthType } = day ?? {}

  const scores = {
    food: getFoodScore(foodCalories),
    cardio: getCardioScore(cardioType as any, cardioCount),
    strength: getStrengthScore(strengthDone),
  }

  const dayScore = getDayScore(scores)

  return (
    <>
      <Form
        className="space-y-6 lg:space-y-8"
        onSubmit={async (values) => {}}
        enableReinitialize
        initialValues={day}
      >
        <CategoryGroup
          icon={<Icons.Food />}
          score={scores.food}
          title="Food"
          details={foodCalories ? `${foodCalories} KCAL` : 'You gotta eat, cmon'}
        >
          <FoodEditMode />
        </CategoryGroup>
        <CategoryGroup
          icon={<Icons.Cardio />}
          score={scores.cardio}
          title="Cardio"
          details={cardioType ?? 'Did you run today?'}
        >
          <CardioEditMode />
        </CategoryGroup>
        <CategoryGroup
          icon={<Icons.Strength />}
          score={scores.strength}
          title="Strength"
          details={strengthType ?? 'NO PAIN NO GAIN'}
        >
          <StrengthEditMode />
        </CategoryGroup>
        <OverallScore
          title="Day score"
          score={dayScore}
          comment={day ? getDayScoreComment(dayScore) : 'IDK, maybe the day has just started?'}
        />
      </Form>
    </>
  )
}

export default DaySummary
