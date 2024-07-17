import { useQuery } from '@blitzjs/rpc'
import { useMutation } from '@blitzjs/rpc'
import classNames from 'classnames'
import * as Icons from 'src/components/icons'
import { forwardRef, useRef } from 'react'
import TextField, { TextFieldProps } from 'src/components/TextField'
import updateDay from '../mutations/updateDay'
import createDay from '../mutations/createDay'
import CategoryGroup from './CategoryGroup'
import useFocusOnMount from 'src/hooks/useFocusOnMount'
import { transitionDuration } from 'src/hooks/useStepTransition'
import { Field, Form, Formik, useField, useFormikContext } from 'formik'
import getDay, { DayPayload } from '../queries/getDay'
import ErrorMessage from 'src/components/ErrorMessage'
import Macros from './Macros'
import Calories from './Calories'
import CaloriesBurned from './CaloriesBurned'
import CalorieDeficit from './CalorieDeficit'

type InputProps = TextFieldProps

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { className, ...textFieldProps } = props

  return (
    <TextField
      ref={ref}
      className={classNames('text-base font-bold text-right text-neutral-500 uppercase', className)}
      {...textFieldProps}
    />
  )
})

type FieldEditModeProps = {
  label: string
  ariaLabel?: string
  name: string
}

function FieldEditMode(props: FieldEditModeProps) {
  const input = useRef<HTMLInputElement | null>(null)
  // this component animates in, and focusing moving inputs generates flickering.
  // delaying the focus by 1.2x the transition duration is a safety measure
  useFocusOnMount(input, transitionDuration['transition-vertical'] * 1.2)

  return (
    <div className="flex items-end space-x-3">
      <Input
        ref={input}
        className="w-24 xl:text-xl"
        name={props.name}
        type="number"
        pattern="[0-9]*"
        min="0"
        aria-label={props.ariaLabel || props.name}
      />
      <span className="mb-1 text-base font-bold uppercase text-neutral-500 xl:text-lg">
        {props.label}
      </span>
    </div>
  )
}

function Card(props: { children: React.ReactNode }) {
  return <section className="w-full p-2 space-y-2 bg-neutral-100">{props.children}</section>
}

function CardTitle(props: { children: React.ReactNode }) {
  return (
    <h1 className="flex items-center space-x-2 text-xs font-extrabold uppercase text-neutral-500">
      {props.children}
    </h1>
  )
}

function CardIcon(props: {
  component: React.FunctionComponent<{
    className?: string
  }>
}) {
  const { component: Component } = props

  return <Component className="!w-5 !h-5 !p-0 !bg-transparent"></Component>
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

  const [update] = useMutation(updateDay)
  const [create] = useMutation(createDay)

  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  return (
    <Formik
      onSubmit={async (values) => {
        const data: Omit<DayPayload, 'date' | 'goals'> = {
          caloriesBurned: Number(values.foodCalories || 0),
          foodCalories: Number(values.foodCalories || 0),
          foodCarbs: Number(values.foodCarbs || 0),
          foodFat: Number(values.foodFat || 0),
          foodProtein: Number(values.foodProtein || 0),
        }

        setQueryData({ ...data, date: currentDay, goals: day?.goals ?? null }, { refetch: false })

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
        caloriesBurned: day?.caloriesBurned || '',
        foodCalories: day?.foodCalories || '',
        foodCarbs: day?.foodCarbs || '',
        foodProtein: day?.foodProtein || '',
        foodFat: day?.foodFat,
      }}
    >
      <Form className="flex flex-col justify-start flex-1 space-y-3 xl:space-y-4">
        {isLoading ? (
          'Loading'
        ) : day ? (
          <>
            <Card>
              <CardTitle>
                <span>Calories Consumed</span>
              </CardTitle>
              <Calories day={day}></Calories>
            </Card>
            <Card>
              <CardTitle>
                <CardIcon component={Icons.Food}></CardIcon>
                <span>Macros Consumed</span>
              </CardTitle>
              <Macros day={day}></Macros>
            </Card>
            <div className="flex space-x-3 xl:space-x-4">
              <Card>
                <CardTitle>
                  <CardIcon component={Icons.Cardio}></CardIcon>
                  <span>Calories Burned</span>
                </CardTitle>
                <CaloriesBurned day={day} />
              </Card>
              <Card>
                <CardTitle>
                  <CardIcon component={Icons.Strength}></CardIcon>
                  <span>
                    Calorie {day.goals?.foodCaloriesType === 'CEILING' ? 'Deficit' : 'Superavit'}
                  </span>
                </CardTitle>
                <CalorieDeficit
                  day={day}
                  goalType={day.goals?.foodCaloriesType === 'CEILING' ? 'DEFICIT' : 'SUPERAVIT'}
                />
              </Card>
            </div>
          </>
        ) : (
          'No Data'
        )}
        {/* <CategoryGroup
          noData={!day?.foodCalories}
          isLoading={isLoading}
          icon={<Icons.Food />}
          value={day?.foodCalories}
          title="Calories"
          details={day?.foodCalories ? `${day?.foodCalories} KCAL` : 'You gotta eat, cmon'}
        >
          <FieldEditMode name="foodCalories" label="KCAL" />
        </CategoryGroup>
        <CategoryGroup
          noData={!day?.foodCarbs}
          isLoading={isLoading}
          icon={<Icons.Food />}
          value={day?.foodCarbs}
          title="Carbs"
          details={day?.foodCarbs ? `${day.foodCarbs}g.` : 'Energy for working out!'}
        >
          <FieldEditMode name="foodCarbs" label="Grams" />
        </CategoryGroup>
        <CategoryGroup
          noData={!day?.foodProtein}
          isLoading={isLoading}
          icon={<Icons.Food />}
          value={day?.foodProtein}
          title="Protein"
          details={day?.foodProtein ? `${day.foodProtein}g.` : 'Chicken Breast Galore'}
        >
          <FieldEditMode name="foodProtein" label="Grams" />
        </CategoryGroup>
        <CategoryGroup
          noData={!day?.foodFat}
          isLoading={isLoading}
          icon={<Icons.Food />}
          value={day?.foodFat}
          title="Fat"
          details={day?.foodFat ? `${day.foodFat}g.` : 'Try and avoid this one'}
        >
          <FieldEditMode name="foodFat" label="Grams" />
        </CategoryGroup> */}
        {/* <div className="flex items-center flex-1">
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
        </div> */}
      </Form>
    </Formik>
  )
}

export default DaySummary
