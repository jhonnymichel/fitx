import { BodyMetrics } from 'db'

type CurrentWeightProps = {
  bodyMetrics?: BodyMetrics | null
}

function CurrentWeight(props: CurrentWeightProps) {
  if (props.bodyMetrics) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-600">
          {props.bodyMetrics.weightInKilograms}
          <span className="text-xl">kg</span>
        </h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center space-y-1">
      <h1 className="text-sm font-extrabold text-center uppercase text-neutral-600">No Data</h1>
      <div>
        <button
          type="button"
          className="block w-auto mx-auto mt-4 mb-4 text-white bg-teal-700 button"
        >
          Log Weight
        </button>
      </div>
    </div>
  )
}

export default CurrentWeight
