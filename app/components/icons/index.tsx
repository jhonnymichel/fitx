import FoodIcon from 'app/components/icons/colheita.svg'
import CardioIcon from 'app/components/icons/tenis-de-corrida.svg'
import StrengthIcon from 'app/components/icons/academia.svg'

export function Food() {
  return (
    <div className="flex w-16 h-16 p-2 text-green-900 bg-gray-200 rounded-full xl:p-3 xl:w-20 xl:h-20 place-items-center">
      <FoodIcon className="w-full fill-current" />
    </div>
  )
}

export function Cardio() {
  return (
    <div className="flex w-16 h-16 p-2 text-blue-800 bg-gray-200 rounded-full xl:p-3 xl:w-20 xl:h-20 place-items-center">
      <CardioIcon className="w-full fill-current" />
    </div>
  )
}

export function Strength() {
  return (
    <div className="flex w-16 h-16 p-2 text-red-800 bg-gray-200 rounded-full xl:p-3 xl:w-20 xl:h-20 place-items-center">
      <StrengthIcon className="w-full fill-current" />
    </div>
  )
}
