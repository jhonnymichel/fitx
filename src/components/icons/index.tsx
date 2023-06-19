import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import FoodIcon from 'src/components/icons/colheita.svg'
import CardioIcon from 'src/components/icons/tenis-de-corrida.svg'
import StrengthIcon from 'src/components/icons/academia.svg'
import LoadingCircle from '../LoadingCircle'

type IconProps = {
  className?: string
  children: React.ReactNode
  isLoading?: boolean
}

function LoadingOverlay() {
  return (
    <div className="absolute z-50 scale-50">
      <LoadingCircle />
    </div>
  )
}

function Icon({ className, children, isLoading }: IconProps) {
  return (
    <div
      className={classNames(
        'flex w-16 relative h-16 p-2 bg-neutral-100 rounded-full xl:p-3 xl:w-20 xl:h-20 items-center justify-center',
        className
      )}
    >
      <CSSTransition in={isLoading} timeout={200} classNames="transition-fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <div
        className={classNames('transition-opacity duration-200', {
          'opacity-25': isLoading,
          'opacity-100': !isLoading,
        })}
      >
        {children}
      </div>
    </div>
  )
}

type Props = {
  isLoading?: boolean
}

export function Food(props: Props) {
  return (
    <Icon className="text-green-900" {...props}>
      <FoodIcon className="w-full fill-current" />
    </Icon>
  )
}

export function Cardio(props: Props) {
  return (
    <Icon className="text-green-900" {...props}>
      <CardioIcon className="w-full fill-current" />
    </Icon>
  )
}

export function Strength(props: Props) {
  return (
    <Icon className="text-green-900" {...props}>
      <StrengthIcon className="w-full fill-current" />
    </Icon>
  )
}
