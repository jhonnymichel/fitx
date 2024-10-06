function LoadingCircle() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default LoadingCircle
