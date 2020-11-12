import classNames from 'classnames'
import FoodIcon from 'app/components/icons/colheita.svg'
import CardioIcon from 'app/components/icons/tenis-de-corrida.svg'
import StrengthIcon from 'app/components/icons/academia.svg'
import LoadingCircle from '../LoadingCircle'

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
        'flex w-16 relative h-16 p-2 bg-gray-200 rounded-full xl:p-3 xl:w-20 xl:h-20 items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="absolute z-50 transform scale-50">
      <LoadingCircle />
    </div>
  )
}

type Props = {
  isLoading?: boolean
}

export function Food({ isLoading }: Props) {
  return (
    <IconBackground className="text-green-900">
      {isLoading && <LoadingOverlay />}
      <FoodIcon
        className={classNames('w-full transition-opacity fill-current', {
          'opacity-25': isLoading,
          'opacity-100': !isLoading,
        })}
      />
    </IconBackground>
  )
}

export function Cardio({ isLoading }: Props) {
  return (
    <IconBackground className="text-blue-800">
      {isLoading && <LoadingOverlay />}
      <CardioIcon
        className={classNames('w-full transition-opacity fill-current', {
          'opacity-25': isLoading,
          'opacity-100': !isLoading,
        })}
      />
    </IconBackground>
  )
}

export function Strength({ isLoading }: Props) {
  return (
    <IconBackground className="text-red-800">
      {isLoading && <LoadingOverlay />}
      <StrengthIcon
        className={classNames('w-full transition-opacity fill-current', {
          'opacity-25': isLoading,
          'opacity-100': !isLoading,
        })}
      />
    </IconBackground>
  )
}
