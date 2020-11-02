import RequireAuth from 'app/auth/components/RequireAuth'
import Card from 'app/components/Card'
import { useState } from 'react'

function Index(): JSX.Element {
  const [count, setCount] = useState(0)

  return (
    <RequireAuth>
      <div className="p-4">
        <Card>
          Logadomon!
          <div>
            count is {count} <button onClick={() => setCount(count + 1)}>Increase</button>
          </div>
        </Card>
      </div>
    </RequireAuth>
  )
}

export default Index
