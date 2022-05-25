import { HeaderContainer, HeaderNav, HeaderTitle } from 'app/components/Header'
import NavButton from 'app/components/NavButton'
import { DateTime } from 'luxon'
import { MouseEvent } from 'react'

type WeekHeaderProps = {
  weekRange: [Date, Date]
  onPrevClick: (e: MouseEvent<HTMLButtonElement>) => void
  onNextClick: (e: MouseEvent<HTMLButtonElement>) => void
}

function WeekHeader({ weekRange, onPrevClick, onNextClick }: WeekHeaderProps) {
  const [start, end] = weekRange
  return (
    <HeaderContainer>
      <HeaderNav>
        <NavButton onClick={onPrevClick}>{`<`}</NavButton>
        <NavButton onClick={onNextClick}>{`>`}</NavButton>
      </HeaderNav>
      <HeaderTitle>
        {DateTime.fromJSDate(start).toLocaleString(DateTime.DATE_MED)}
        {' - '}
        {DateTime.fromJSDate(end).toLocaleString(DateTime.DATE_MED)}
      </HeaderTitle>
    </HeaderContainer>
  )
}

export default WeekHeader
