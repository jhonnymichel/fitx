import { HeaderContainer, HeaderNav, HeaderTitle } from 'src/core/components/Header'
import NavButton from 'src/core/components/NavButton'
import { DateTime } from 'luxon'
import { MouseEvent } from 'react'

type DayHeaderProps = {
  currentDay: Date
  onPrevClick: (e: MouseEvent<HTMLButtonElement>) => void
  onNextClick: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

function DayHeader({ disabled, currentDay, onPrevClick, onNextClick }: DayHeaderProps) {
  return (
    <HeaderContainer>
      <HeaderNav>
        <NavButton disabled={disabled} onClick={onPrevClick}>{`<`}</NavButton>
        <NavButton disabled={disabled} onClick={onNextClick}>{`>`}</NavButton>
      </HeaderNav>
      <HeaderTitle>
        {DateTime.fromJSDate(currentDay).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
      </HeaderTitle>
    </HeaderContainer>
  )
}

export default DayHeader
