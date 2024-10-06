import classNames from 'classnames'
import FoodIcon from 'src/core/components/icons/colheita.svg'
import CardioIcon from 'src/core/components/icons/tenis-de-corrida.svg'
import StrengthIcon from 'src/core/components/icons/academia.svg'
import ScaleIcon from 'src/core/components/icons/scale.svg'

type IconProps = {
  className?: string
  children: React.ReactNode
  isLoading?: boolean
}

function Icon({ className, children }: IconProps) {
  return (
    <div
      className={classNames(
        'flex w-14 relative h-14 p-2 text-green-900 bg-neutral-200 rounded-full items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  )
}

type Props = {
  className?: string
}

export function Food(props: Props) {
  return (
    <Icon {...props}>
      <FoodIcon className="w-full fill-current" />
    </Icon>
  )
}

export function Cardio(props: Props) {
  return (
    <Icon {...props}>
      <CardioIcon className="w-full fill-current" />
    </Icon>
  )
}

export function Strength(props: Props) {
  return (
    <Icon {...props}>
      <StrengthIcon className="w-full fill-current" />
    </Icon>
  )
}

export function Scale(props: Props) {
  return (
    <Icon {...props}>
      <ScaleIcon className="w-full stroke-current" />
    </Icon>
  )
}
