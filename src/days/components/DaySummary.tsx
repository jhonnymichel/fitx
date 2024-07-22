import * as Icons from 'src/components/icons'
import { DayPayload } from '../queries/getDay'
import ErrorMessage from 'src/components/ErrorMessage'
import Macros from './Macros'
import Calories from './Calories'
import CaloriesBurned from './CaloriesBurned'
import CalorieDeficit from './CalorieDeficit'
import { WidgetCard, WidgetCardIcon, WidgetCardTitle } from 'src/components/WidgetCard'



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
        <WidgetCard>
          <WidgetCardTitle>
            <span>Calories Consumed</span>
          </WidgetCardTitle>
          <Calories day={day}></Calories>
        </WidgetCard>
        <WidgetCard>
          <WidgetCardTitle>
            <WidgetCardIcon component={Icons.Food}></WidgetCardIcon>
            <span>Macros Consumed</span>
          </WidgetCardTitle>
          <Macros day={day}></Macros>
        </WidgetCard>
        <div className="flex space-x-3 xl:space-x-4">
          <WidgetCard>
            <WidgetCardTitle>
              <WidgetCardIcon component={Icons.Cardio}></WidgetCardIcon>
              <span>Calories Burned</span>
            </WidgetCardTitle>
            <CaloriesBurned day={day} />
          </WidgetCard>
          <WidgetCard>
            <WidgetCardTitle>
              <WidgetCardIcon component={Icons.Strength}></WidgetCardIcon>
              <span>
                Calorie {day.goals?.foodCaloriesType === 'CEILING' ? 'Deficit' : 'Superavit'}
              </span>
            </WidgetCardTitle>
            <CalorieDeficit
              day={day}
              goalType={day.goals?.foodCaloriesType === 'CEILING' ? 'DEFICIT' : 'SUPERAVIT'}
            />
          </WidgetCard>
        </div>
      </div>
    )
  }

  return <div>NO DATA</div>
}

export default DaySummary
