import { useAuthenticatedAppSession } from 'src/blitz-server'
import Day from './components/day'

async function DayPage() {
  await useAuthenticatedAppSession({
    redirectTo: '/signup',
  })

  return <Day></Day>
}

export default DayPage
