import { HeaderContainer, HeaderNav, HeaderTitle } from 'app/components/Header'
import NavButton from 'app/components/NavButton'
import { DateTime } from 'luxon'
import { MouseEvent } from 'react'

type DayHeaderProps = {
  currentDay: Date
  onPrevClick: (e: MouseEvent<HTMLButtonElement>) => void
  onNextClick: (e: MouseEvent<HTMLButtonElement>) => void
}

function DayHeader({ currentDay, onPrevClick, onNextClick }: DayHeaderProps) {
  return (
    <HeaderContainer>
      <HeaderNav>
        <NavButton onClick={onPrevClick}>{`<`}</NavButton>
        <NavButton onClick={onNextClick}>{`>`}</NavButton>
      </HeaderNav>
      <HeaderTitle>
        {DateTime.fromJSDate(currentDay).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
      </HeaderTitle>
    </HeaderContainer>
  )
}

export default DayHeader
