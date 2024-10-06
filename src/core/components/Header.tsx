import classNames from 'classnames'
import React from 'react'

type HeaderItemProps = {
  children: React.ReactNode
  className?: string
}

export function HeaderContainer(props: HeaderItemProps) {
  return <div className="flex justify-between w-full mb-3">{props.children}</div>
}

export function HeaderNav(props: HeaderItemProps) {
  return <div className="space-x-1">{props.children}</div>
}

export function HeaderTitle(props: HeaderItemProps) {
  return <h1 className={classNames('text-2xl text-semibold', props.className)}>{props.children}</h1>
}
