export function WidgetCard(props: { children: React.ReactNode }) {
  return <section className="w-full p-2 space-y-2 bg-neutral-100">{props.children}</section>
}

export function WidgetCardTitle(props: { children: React.ReactNode }) {
  return (
    <h1 className="flex items-center space-x-2 text-xs font-extrabold uppercase text-neutral-500">
      {props.children}
    </h1>
  )
}

export function WidgetCardIcon(props: {
  component: React.FunctionComponent<{
    className?: string
  }>
}) {
  const { component: Component } = props

  return <Component className="!w-5 !h-5 !p-0 !bg-transparent"></Component>
}
