import { HeaderContainer, HeaderNav, HeaderTitle } from 'src/core/components/Header'
import NavButton from 'src/core/components/NavButton'
import { DateTime } from 'luxon'
import { MouseEvent } from 'react'
import { PeriodMode } from 'src/core/dateUtils'

type PeriodProgressHeaderProps = {
  periodRange: [Date, Date]
  onPrevClick: (e: MouseEvent<HTMLButtonElement>) => void
  onNextClick: (e: MouseEvent<HTMLButtonElement>) => void
  currentPeriod: PeriodMode
}

function PeriodProgressHeader({
  periodRange,
  onPrevClick,
  onNextClick,
  currentPeriod,
}: PeriodProgressHeaderProps) {
  const [start, end] = periodRange
  return (
    <HeaderContainer>
      <HeaderNav>
        <NavButton onClick={onPrevClick}>{`<`}</NavButton>
        <NavButton onClick={onNextClick}>{`>`}</NavButton>
      </HeaderNav>
      {currentPeriod === 'week' ? (
        <HeaderTitle className="text-xl">
          {DateTime.fromJSDate(start).toLocaleString({ month: 'short', day: 'numeric' })}
          {' - '}
          {DateTime.fromJSDate(end).toLocaleString(DateTime.DATE_MED)}
        </HeaderTitle>
      ) : (
        <HeaderTitle className="text-xl">
          {DateTime.fromJSDate(start).toLocaleString({ month: 'long', year: 'numeric' })}
        </HeaderTitle>
      )}
    </HeaderContainer>
  )
}

export default PeriodProgressHeader
4
