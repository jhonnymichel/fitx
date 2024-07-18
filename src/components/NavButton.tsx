type NavButtonProps = { onClick: any; children: React.ReactNode; disabled?: boolean} 

function NavButton({ onClick, children, disabled }: NavButtonProps) {
  return (
    <button disabled={disabled} className="px-4 text-white bg-teal-600 button" onClick={onClick}>
      {children}
    </button>
  )
}

export default NavButton
