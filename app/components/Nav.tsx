import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'

function NavLink({ href, children }) {
  const router = useRouter()

  return (
    <Link href={href}>
      <a
        className={classNames(
          'transform text-center block text-teal-700 font-semibold text-block py-1 px-2 flex-1 hover:bg-gray-200 border-b border-transparent',
          {
            'border-teal-700': router.pathname === href,
          }
        )}
      >
        {children}
      </a>
    </Link>
  )
}

function Nav() {
  return (
    <div className="flex-shrink-0 w-full max-w-lg pb-4">
      <nav className="flex w-full">
        <NavLink href="/">Day</NavLink>
        <NavLink href="/week">Week</NavLink>
        <NavLink href="/month">Month</NavLink>
      </nav>
    </div>
  )
}

export default Nav
