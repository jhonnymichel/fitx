import * as Icons from 'app/components/icons'

function CategoryGroup() {
  return <div></div>
}

export function LoadingDaySummary() {
  return <>Loading</>
}

function DaySummary() {
  return (
    <div className="space-y-4">
      <Icons.Cardio />
      <Icons.Food />
      <Icons.Strength />
    </div>
  )
}

export default DaySummary
