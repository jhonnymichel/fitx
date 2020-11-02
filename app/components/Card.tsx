function Card({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="w-full p-4 bg-white rounded-md shadow-lg">{children}</div>
}

export default Card
