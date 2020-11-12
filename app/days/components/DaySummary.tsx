import { Day } from 'db'
import classNames from 'classnames'
import * as Icons from 'app/components/icons'
import { forwardRef, useEffect, useRef, useState } from 'react'
import OverallScore from 'app/components/OverallScore'
import getDayScore, { getCardioScore, getFoodScore, getStrengthScore } from '../getScore'
import Form from 'app/components/Form'
import TextField, { TextFieldProps } from 'app/components/TextField'
import { useMutation } from 'blitz'
import updateDay from '../mutations/updateDay'
import createDay from '../mutations/createDay'
import getDayScoreComment from '../getDayScoreComment'
import CategoryGroup from './CategoryGroup'
import useFocusOnMount from 'app/hooks/useFocusOnMount'
import { transitionDuration } from 'app/hooks/useStepTransition'
import { Field, useField, useFormikContext } from 'formik'

type InputProps = TextFieldProps

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { className, ...textFieldProps } = props

  return (
    <TextField
      ref={ref}
      className={classNames('text-base font-bold text-right text-gray-500 uppercase', className)}
      {...textFieldProps}
    />
  )
})

function FoodEditMode() {
  const input = useRef<HTMLInputElement | null>(null)

  // this component animates in, and focusing moving inputs generates flickering.
  // delaying the focus by 1.2x the transition duration is a safety measure
  useFocusOnMount(input, transitionDuration['transition-vertical'] * 1.2)

  return (
    <div className="flex items-end space-x-2">
      <Input
        ref={input}
        className="w-24 xl:text-xl"
        name="foodCalories"
        type="number"
        min="0"
        aria-label="Calories"
      />
      <span className="mb-1 text-base font-bold text-gray-500 uppercase xl:text-lg">Kcal</span>
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
    <div className="flex items-center justify-around space-y-2">
      <Input
        ref={inputRef}
        disabled={!selectField.value}
        className="w-24 xl:text-lg"
        name="cardioCount"
        type="number"
        min="0"
        aria-label={selectField.value === 'activeCalories' ? 'Cal. Burned' : 'Steps'}
      />
      <div>
        <div role="group0" className="flex flex-col" aria-labelledby="my-radio-group">
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
      <Input ref={input} className="xl:text-xl" name="strengthType" label="Today training" />
    </div>
  )
}

function getCardioText(count, type) {
  if (type === 'activeCalories') {
    return count + ' Cal. Burned'
  }

  return `${count} ${type}`
}

type DaySummaryProps = {
  day?: Day
  isLoading?: boolean
  refetch?: () => void
  currentDay: Date
}

function DaySummary({ day, isLoading, refetch, currentDay }: DaySummaryProps) {
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
        className="flex flex-col justify-around flex-1 space-y-6 xl:space-y-8"
        onSubmit={async (values) => {
          if (values.strengthType) {
            values.strengthDone = true
          } else {
            values.strengthDone = false
          }

          setLocalDay(values)

          try {
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
          } catch (e) {
            console.error('bugou', e)
          }

          refetch?.()
        }}
        enableReinitialize
        initialValues={{
          date: currentDay,
          foodCalories: foodCalories ?? 0,
          cardioCount: cardioCount ?? 0,
          cardioType: cardioType ?? '',
          strengthDone: strengthDone ?? false,
          strengthType: strengthType ?? '',
        }}
      >
        <CategoryGroup
          noData={!foodCalories}
          isLoading={isLoading}
          icon={<Icons.Food isLoading={isLoading} />}
          score={scores.food}
          title="Food"
          details={foodCalories ? `${foodCalories} KCAL` : 'You gotta eat, cmon'}
        >
          <FoodEditMode />
        </CategoryGroup>
        <CategoryGroup
          noData={!cardioCount}
          isLoading={isLoading}
          icon={<Icons.Cardio isLoading={isLoading} />}
          score={scores.cardio}
          title="Cardio"
          details={cardioCount ? getCardioText(cardioCount, cardioType) : 'Did you run today?'}
        >
          <CardioEditMode />
        </CategoryGroup>
        <CategoryGroup
          noData={!strengthType}
          isLoading={isLoading}
          icon={<Icons.Strength isLoading={isLoading} />}
          score={scores.strength}
          title="Strength"
          details={strengthType || 'NO PAIN NO GAIN'}
        >
          <StrengthEditMode />
        </CategoryGroup>
        <div className="flex items-center flex-1">
          <OverallScore
            noData={foodCalories == null && cardioCount == null && strengthType == null}
            isLoading={isLoading}
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
