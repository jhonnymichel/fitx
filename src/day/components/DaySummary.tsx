import * as Icons from 'src/core/components/icons'
import { DayPayload } from '../queries/getDay'
import ErrorMessage from 'src/core/components/ErrorMessage'
import Macros from './Macros'
import Calories from './Calories'
import CaloriesBurned from './CaloriesBurned'
import CalorieDeficit from './CalorieDeficit'
import { getCaloriesGoalType } from 'src/fitnessMetrics/calorieDeficit'
import CurrentWeight from './CurrentWeight'
import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from 'src/widgets/components/WidgetCard'

type DaySummaryProps = {
  isLoading: boolean
  data?: DayPayload
  refetch: () => void
  error: unknown
}

function DaySummary({ data, refetch, error, isLoading }: DaySummaryProps) {
  if (error && (error as Error).name !== 'NotFoundError') {
    return <ErrorMessage error={error as Error} resetErrorBoundary={refetch} />
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <div className="space-y-2 xl:space-y-4">
      <div className="flex space-x-2 xl:space-x-4">
        <div className="flex shrink-0">
          <WidgetCard>
            <WidgetCardTitle>
              <WidgetCardIcon component={Icons.Scale}></WidgetCardIcon>
              <span>Weight</span>
            </WidgetCardTitle>
            <CurrentWeight
              bodyMetrics={data?.bodyMetrics}
              deficitType={getCaloriesGoalType(data?.day?.goals ?? null)}
            ></CurrentWeight>
          </WidgetCard>
        </div>
        <WidgetCard>
          <WidgetCardTitle>
            <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>

            <span>Calories Consumed</span>
          </WidgetCardTitle>
          <Calories day={data?.day}></Calories>
        </WidgetCard>
      </div>

      {data?.day && (
        <>
          <WidgetCard>
            <WidgetCardTitle>
              <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>
              <span>Macros Consumed</span>
            </WidgetCardTitle>
            <Macros day={data.day}></Macros>
          </WidgetCard>
          <div className="flex space-x-2 xl:space-x-4">
            <WidgetCard>
              <WidgetCardTitle>
                <WidgetCardIcon component={Icons.Cardio}></WidgetCardIcon>
                <span>Calories Burned</span>
              </WidgetCardTitle>
              <CaloriesBurned day={data.day} />
            </WidgetCard>
            <WidgetCard>
              <WidgetCardTitle>
                <WidgetCardIcon component={Icons.Strength}></WidgetCardIcon>
                <span>
                  Calorie{' '}
                  {getCaloriesGoalType(data.day.goals) === 'DEFICIT' ? 'Deficit' : 'Superavit'}
                </span>
              </WidgetCardTitle>
              <CalorieDeficit day={data.day} />
            </WidgetCard>
          </div>
        </>
      )}
    </div>
  )
}

export default DaySummary
