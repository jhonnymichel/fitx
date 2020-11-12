import classNames from 'classnames'
import FoodIcon from 'app/components/icons/colheita.svg'
import CardioIcon from 'app/components/icons/tenis-de-corrida.svg'
import StrengthIcon from 'app/components/icons/academia.svg'

function IconBackground({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={classNames(
        'flex w-16 h-16 p-2 bg-gray-200 rounded-full xl:p-3 xl:w-20 xl:h-20 place-items-center',
        className
      )}
    >
      {children}
    </div>
  )
}

export function Food() {
  return (
    <IconBackground className="text-green-900">
      <FoodIcon className="w-full fill-current" />
    </IconBackground>
  )
}

export function Cardio() {
  return (
    <IconBackground className="text-blue-800">
      <CardioIcon className="w-full fill-current" />
    </IconBackground>
  )
}

export function Strength() {
  return (
    <IconBackground className="text-red-800">
      <StrengthIcon className="w-full fill-current" />
    </IconBackground>
  )
}
