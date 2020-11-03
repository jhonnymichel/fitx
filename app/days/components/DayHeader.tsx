import { DateTime } from 'luxon'

function DayHeader() {
  return (
    <div className="flex justify-between w-full mb-10">
      <h1 className="text-2xl text-semibold">
        {DateTime.local().toLocaleString(DateTime.DATE_MED)}
      </h1>
    </div>
  )
}

export default DayHeader
