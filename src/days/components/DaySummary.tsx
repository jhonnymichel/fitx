import * as Icons from 'src/components/icons'
import { DayPayload } from '../queries/getDay'
import ErrorMessage from 'src/components/ErrorMessage'
import Macros from './Macros'
import Calories from './Calories'
import CaloriesBurned from './CaloriesBurned'
import CalorieDeficit from './CalorieDeficit'

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
  isLoading: boolean
  data?: DayPayload
  refetch: () => void
  error: unknown
}

function DaySummary({ data: day, refetch, error, isLoading }: DaySummaryProps) {
  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  if (day) {
    return (
      <div className="space-y-3">
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
      </div>
    )
  }

  return <div>NO DATA</div>
}

export default DaySummary
