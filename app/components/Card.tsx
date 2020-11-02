function Card({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">{children}</div>
}

export default Card
