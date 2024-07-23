import { invalidateQuery, setQueryData } from '@blitzjs/rpc'
import { useMutation } from '@blitzjs/rpc'
import classNames from 'classnames'
import * as Icons from 'src/components/icons'
import { forwardRef, useRef } from 'react'
import TextField, { TextFieldProps } from 'src/components/TextField'
import { Form, Formik } from 'formik'
import getDay, { DayPayload } from '../queries/getDay'
import upsertDay from '../mutations/upsertDay'
import SubmitButton from 'src/auth/components/SubmitButton'
import getRangeSummary from 'src/widgets/queries/getRangeSummary'

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
  // // this component animates in, and focusing moving inputs generates flickering.
  // // delaying the focus by 1.2x the transition duration is a safety measure
  // useFocusOnMount(input, transitionDuration['transition-vertical'] * 1.2)

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

type DayFormProps = {
  currentDate: Date
  data?: DayPayload
  onEditFinished: () => void
}

function DayForm({ currentDate, data: day, onEditFinished }: DayFormProps) {
  const [upsert] = useMutation(upsertDay)

  return (
    <Formik
      onSubmit={async (values) => {
        const data: Omit<DayPayload, 'date' | 'goals'> = {
          caloriesBurned: Number(values.caloriesBurned || 0),
          foodCalories: Number(values.foodCalories || 0),
          foodCarbs: Number(values.foodCarbs || 0),
          foodFat: Number(values.foodFat || 0),
          foodProtein: Number(values.foodProtein || 0),
        }

        try {
          const responseData = await upsert({ date: currentDate, data })

          setQueryData(
            getDay,
            {
              where: { date: { equals: currentDate } },
            },
            responseData,
            {
              refetch: false,
            }
          )

          invalidateQuery(getRangeSummary)

          onEditFinished()
        } catch (e) {
          window.alert(e)
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
        <>
          <Card>
            <CardTitle>
              <CardIcon component={Icons.Food}></CardIcon>
              <span>Calories Consumed</span>
            </CardTitle>
            <FieldEditMode name="foodCalories" label="KCAL" />
          </Card>
          <Card>
            <CardTitle>
              <CardIcon component={Icons.Food}></CardIcon>
              <span>Macros Consumed</span>
            </CardTitle>
            <FieldEditMode name="foodCarbs" label="Carbs" />
            <FieldEditMode name="foodProtein" label="Protein" />
            <FieldEditMode name="foodFat" label="Fat" />
          </Card>
          <div className="flex space-x-3 xl:space-x-4">
            <Card>
              <CardTitle>
                <CardIcon component={Icons.Cardio}></CardIcon>
                <span>Calories Burned</span>
              </CardTitle>{' '}
              <FieldEditMode name="caloriesBurned" label="Kcal" />
            </Card>
          </div>
        </>
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
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              onEditFinished()
            }}
          >
            Cancel
          </button>
          <SubmitButton>Submit</SubmitButton>
        </div>
      </Form>
    </Formik>
  )
}

export default DayForm
