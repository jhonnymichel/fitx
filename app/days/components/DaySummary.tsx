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
import { Field, useField, useFormikContext } from 'formik'

export function LoadingDaySummary() {
  return <>Loading</>
}

function FoodEditMode() {
  const input = useRef<HTMLInputElement | null>(null)

  // this component animates in, and focusing moving inputs generates flickering.
  // delaying the focus by 1.2x the transition duration is a safety measure
  useFocusOnMount(input, transitionDuration['transition-vertical'] * 1.2)

  return (
    <div className="flex items-end space-x-2">
      <TextField
        ref={input}
        className="w-24 text-xl font-bold text-right text-gray-500 uppercase"
        name="foodCalories"
        type="number"
        min="0"
        placeholder="Calories"
        aria-label="Calories"
      />
      <span className="mb-1 text-lg font-bold text-gray-500 uppercase">Kcal</span>
    </div>
  )
}

function CardioEditMode() {
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // this component animates in, and focusing moving inputs generates flickering.
  // delaying the focus by 1.2x the transition duration is a safety measure
  useFocusOnMount(selectRef, transitionDuration['transition-vertical'] * 1.2)
  const [selectField] = useField('cardioType')
  const { setFieldValue } = useFormikContext()

  const resetInput = () => {
    setFieldValue('cardioCount', 0)
  }

  return (
    <div className="flex flex-col items-center justify-around space-y-2">
      <div>
        <div
          role="group0"
          className="flex justify-around space-x-2"
          aria-labelledby="my-radio-group"
        >
          <label>
            <Field type="radio" name="cardioType" onClick={resetInput} value="activeCalories" />
            <span className="ml-1 text-sm">Active Cal.</span>
          </label>
          <label>
            <Field type="radio" name="cardioType" onClick={resetInput} value="steps" />
            <span className="ml-1 text-sm">Steps</span>
          </label>
        </div>
      </div>
      <TextField
        ref={inputRef}
        disabled={!selectField.value}
        className="w-24 text-lg font-bold text-right text-gray-500 uppercase"
        name="cardioCount"
        type="number"
        min="0"
        aria-label={selectField.value === 'activeCalories' ? 'Cal. Burned' : 'Steps'}
      />
    </div>
  )
}

function StrengthEditMode() {
  const input = useRef<HTMLInputElement | null>(null)

  // this component animates in, and focusing moving inputs generates flickering.
  // delaying the focus by 1.2x the transition duration is a safety measure
  useFocusOnMount(input, transitionDuration['transition-vertical'] * 1.2)

  return (
    <div className="flex items-end space-x-2">
      <TextField
        ref={input}
        className="w-full text-xl font-bold text-gray-500 uppercase"
        name="strengthType"
        label="Today training"
      />
    </div>
  )
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

  function getCardioText(count, type) {
    if (type === 'activeCalories') {
      return count + ' Cal. Burned'
    }

    return `${count} ${type}`
  }

  const dayScore = getDayScore(scores)

  return (
    <>
      <Form
        className="flex flex-col flex-1 space-y-6 lg:space-y-8"
        onSubmit={async (values) => {
          if (values.strengthType) {
            values.strengthDone = true
          } else {
            values.strengthDone = false
          }

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
          details={cardioCount ? getCardioText(cardioCount, cardioType) : 'Did you run today?'}
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
        <div className="flex items-center flex-1">
          <OverallScore
            title="Day score"
            score={dayScore}
            comment={
              dayScore > 0 ? getDayScoreComment(dayScore) : 'IDK, maybe the day has just started?'
            }
          />
        </div>
      </Form>
    </>
  )
}

export default DaySummary
