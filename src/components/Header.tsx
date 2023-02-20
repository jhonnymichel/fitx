import React from 'react'

type HeaderItemProps = {
  children: React.ReactNode
}

export function HeaderContainer(props: HeaderItemProps) {
  return <div className="flex justify-between w-full mb-6">{props.children}</div>
}

export function HeaderNav(props: HeaderItemProps) {
  return <div className="space-x-1">{props.children}</div>
}

export function HeaderTitle(props: HeaderItemProps) {
  return <h1 className="text-2xl text-semibold">{props.children}</h1>
}
