import classNames from 'classnames'
import * as Icons from 'app/components/icons'
import { forwardRef, useRef } from 'react'
import OverallScore from 'app/components/OverallScore'
import getDayScore, { getCardioScore, getFoodScore, getStrengthScore } from '../getScore'
import TextField, { TextFieldProps } from 'app/components/TextField'
import { useMutation, useQuery } from 'blitz'
import updateDay from '../mutations/updateDay'
import createDay from '../mutations/createDay'
import getDayScoreComment from '../getDayScoreComment'
import CategoryGroup from './CategoryGroup'
import useFocusOnMount from 'app/hooks/useFocusOnMount'
import { transitionDuration } from 'app/hooks/useStepTransition'
import { Field, Form, Formik, useField, useFormikContext } from 'formik'
import getDay, { DayPayload } from '../queries/getDay'
import ErrorMessage from 'app/components/ErrorMessage'

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
        pattern="[0-9]*"
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
        pattern="[0-9]*"
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
  currentDay: Date
}

function DaySummary({ currentDay }: DaySummaryProps) {
  const [day, { refetch, setQueryData, error, isLoading }] = useQuery(
    getDay,
    {
      where: { date: { equals: currentDay } },
    },
    { suspense: false, useErrorBoundary: false }
  )

  const { foodCalories, cardioCount, cardioType, strengthDone, strengthType } = day ?? {}

  const [update] = useMutation(updateDay)
  const [create] = useMutation(createDay)

  const scores = {
    food: getFoodScore(foodCalories),
    cardio: getCardioScore(cardioType as any, cardioCount),
    strength: getStrengthScore(strengthDone),
  }

  const dayScore = getDayScore(scores)

  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  return (
    <Formik
      onSubmit={async (values) => {
        const data: Omit<DayPayload, 'date'> = {
          ...values,
          strengthDone: Boolean(values.strengthType),
          cardioCount: Number(values.cardioCount || 0),
          foodCalories: Number(values.foodCalories || 0),
        }

        setQueryData({ ...data, date: currentDay }, { refetch: false })

        try {
          if (day) {
            await update({
              data,
              date: day.date,
            })
          } else {
            await create({
              data: { ...data, date: currentDay },
            })
          }
        } catch (e) {
          console.error('bugou', e)
          if (day) {
            setQueryData(day, { refetch: false })
          }
        }
      }}
      enableReinitialize
      initialValues={{
        foodCalories: foodCalories || '',
        cardioCount: cardioCount || '',
        cardioType: cardioType || '',
        strengthDone: strengthDone || false,
        strengthType: strengthType || '',
      }}
    >
      <Form className="flex flex-col justify-around flex-1 space-y-6 xl:space-y-8">
        <CategoryGroup
          noData={!foodCalories}
          isLoading={isLoading}
          icon={<Icons.Food />}
          score={scores.food}
          title="Food"
          details={foodCalories ? `${foodCalories} KCAL` : 'You gotta eat, cmon'}
        >
          <FoodEditMode />
        </CategoryGroup>
        <CategoryGroup
          noData={!cardioCount}
          isLoading={isLoading}
          icon={<Icons.Cardio />}
          score={scores.cardio}
          title="Cardio"
          details={cardioCount ? getCardioText(cardioCount, cardioType) : 'Did you run today?'}
        >
          <CardioEditMode />
        </CategoryGroup>
        <CategoryGroup
          noData={!strengthType}
          isLoading={isLoading}
          icon={<Icons.Strength />}
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
              [foodCalories, cardioCount, strengthType].every((i) => typeof i !== 'undefined')
                ? getDayScoreComment(dayScore)
                : 'IDK, maybe the day has just started?'
            }
          />
        </div>
      </Form>
    </Formik>
  )
}

export default DaySummary
