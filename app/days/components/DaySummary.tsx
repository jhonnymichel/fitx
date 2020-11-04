import { Day } from 'db'
import * as Icons from 'app/components/icons'
import { useEffect, useRef, useState } from 'react'
import OverallScore from 'app/components/OverallScore'
import getDayScore, { getCardioScore, getFoodScore, getStrengthScore } from '../get-score'
import Form from 'app/components/Form'
import TextField from 'app/components/TextField'
import { useMutation } from 'blitz'
import updateDay from '../mutations/updateDay'
import createDay from '../mutations/createDay'
import { getCurrentDay } from '../date-utils'
import getDayScoreComment from '../getDayScoreComment'
import CategoryGroup from './CategoryGroup'
import useFocusOnMount from 'app/hooks/useFocusOnMount'
import { transitionDuration } from 'app/hooks/useStepTransition'

export function LoadingDaySummary() {
  return <>Loading</>
}

function FoodEditMode() {
  const input = useRef<HTMLInputElement | null>(null)

  useFocusOnMount(input, transitionDuration['transition-vertical'])

  return (
    <div className="flex items-end space-x-2">
      <TextField
        ref={input}
        className="w-24 text-xl font-bold text-right text-gray-500 uppercase"
        name="foodCalories"
        type="number"
        label="Calories"
      />
      <span className="mb-1 text-xl font-bold text-gray-500 uppercase">Kcal</span>
    </div>
  )
}

function CardioEditMode() {
  return <div>edit</div>
}

function StrengthEditMode() {
  return <div>edit</div>
}

function DaySummary({ day }: { day?: Day }) {
  const [localDay, setLocalDay] = useState<Partial<Day>>(day ?? {})
  const { foodCalories, cardioCount, cardioType, strengthDone, strengthType } = localDay

  const [update] = useMutation(updateDay)
  const [create] = useMutation(createDay)

  useEffect(() => {
    setLocalDay(day ?? {})
  }, [setLocalDay, day])

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
        onSubmit={async (values) => {
          setLocalDay(values)
          if (day) {
            await update({
              data: values,
              where: {
                id: day.id,
              },
            })
          } else {
            await create({
              data: values,
            })
          }
        }}
        enableReinitialize
        initialValues={{
          date: getCurrentDay(),
          foodCalories: foodCalories ?? 0,
          cardioCount: cardioCount ?? 0,
          cardioType: cardioType ?? '',
          strengthDone: strengthDone ?? false,
          strengthType: strengthType ?? '',
        }}
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
          details={cardioType || 'Did you run today?'}
        >
          <CardioEditMode />
        </CategoryGroup>
        <CategoryGroup
          icon={<Icons.Strength />}
          score={scores.strength}
          title="Strength"
          details={strengthType || 'NO PAIN NO GAIN'}
        >
          <StrengthEditMode />
        </CategoryGroup>
        <OverallScore
          title="Day score"
          score={dayScore}
          comment={
            dayScore > 0 ? getDayScoreComment(dayScore) : 'IDK, maybe the day has just started?'
          }
        />
      </Form>
    </>
  )
}

export default DaySummary
