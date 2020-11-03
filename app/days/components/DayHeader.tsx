import { DateTime } from 'luxon'

function DayHeader({ edit = false }) {
  return (
    <div className="flex justify-between w-full">
      <h1 className="text-2xl text-semibold">
        {DateTime.local().toLocaleString(DateTime.DATE_MED)}
      </h1>
      {edit && <button>Edit</button>}
    </div>
  )
}

export default DayHeader
