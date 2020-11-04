import { Link, useRouter } from 'blitz'
import classNames from 'classnames'

function Nav() {
  const router = useRouter()

  return (
    <div className="flex-shrink-0 w-full max-w-lg pb-4">
      <nav className="flex w-full">
        <Link href="/">
          <a
            className={classNames(
              'transform text-center block text-teal-700 font-semibold text-block py-1 px-2 flex-1 hover:bg-gray-200 border-b border-transparent',
              {
                'border-teal-700': router.pathname === '/',
              }
            )}
          >
            Day
          </a>
        </Link>
        <Link href="/week">
          <a
            className={classNames(
              'transform text-center block text-teal-700 font-semibold text-block py-1 px-2 flex-1 hover:bg-gray-200 border-b border-transparent',
              {
                'border-teal-700': router.pathname === '/week',
              }
            )}
          >
            Week
          </a>
        </Link>
        <Link href="/month">
          <a
            className={classNames(
              'transform text-center block text-teal-700 font-semibold text-block py-1 px-2 flex-1 hover:bg-gray-200 border-b border-transparent',
              {
                'border-teal-700': router.pathname === '/month',
              }
            )}
          >
            Month
          </a>
        </Link>
      </nav>
    </div>
  )
}

export default Nav
