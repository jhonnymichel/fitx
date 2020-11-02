import { Link, useRouter } from 'blitz'
import classNames from 'classnames'

function Nav() {
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto">
      <nav className="flex w-full space-x-4">
        <Link href="/">
          <a
            className={classNames(
              'transform text-center block rounded-md bg-white text-green-800 shadow-xs font-semibold text-block py-1 px-2 flex-1 hover:shadow-md hover:scale-105 transition-transform duration-500 origin-center',
              {
                'scale-105 shadow-md': router.pathname === '/',
              }
            )}
          >
            Day
          </a>
        </Link>
        <Link href="/week">
          <a
            className={classNames(
              'transform text-center block rounded-md bg-white text-green-800 shadow-xs font-semibold text-block py-1 px-2 flex-1 hover:shadow-md hover:scale-105 transition-all duration-500 origin-center',
              {
                'scale-105 shadow-md': router.pathname === '/week',
              }
            )}
          >
            Week
          </a>
        </Link>
        <Link href="/month">
          <a
            className={classNames(
              'transform text-center block rounded-md bg-white text-green-800 shadow-xs font-semibold text-block py-1 px-2 flex-1 hover:shadow-md hover:scale-105 transition-transform duration-500 origin-center',
              {
                'scale-105 shadow-md': router.pathname === '/month',
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
