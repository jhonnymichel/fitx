import RequireAuth from 'app/auth/components/RequireAuth'

function Index(): JSX.Element {
  return (
    <RequireAuth>
      <div className="p-4">
        <div className="max-w-md p-4 mx-auto mt-20 bg-white rounded-md shadow-lg">Logadomon!</div>
      </div>
    </RequireAuth>
  )
}

export default Index
