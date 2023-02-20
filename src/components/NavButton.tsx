function NavButton({ onClick, children }) {
  return (
    <button className="px-4 text-white bg-teal-600 button" onClick={onClick}>
      {children}
    </button>
  )
}

export default NavButton
