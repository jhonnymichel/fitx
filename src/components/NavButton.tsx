function NavButton({ onClick, children, disabled }) {
  return (
    <button disabled={disabled} className="px-4 text-white bg-teal-600 button" onClick={onClick}>
      {children}
    </button>
  )
}

export default NavButton
