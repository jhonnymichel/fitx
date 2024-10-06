import Card from 'src/core/components/Card'
import WithNav from 'src/layouts/WithNav'

function Month() {
  return <Card>Month</Card>
}

Month.getLayout = function WithNavLayout(page) {
  return <WithNav>{page}</WithNav>
}

export default Month
