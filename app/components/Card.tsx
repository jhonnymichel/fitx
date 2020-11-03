function Card({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="w-full p-4 overflow-auto bg-white rounded-md shadow-lg md:p-6">{children}</div>
  )
}

export default Card
