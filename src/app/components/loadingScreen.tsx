interface LoadingProps{
    height:string
}

const LoadingScreen = ({height}:LoadingProps) => {
  return (
      <div className={`loading-container h-[${height}]`}>
          
          <div className="moving-image max-w-[10vw]"></div>
          <div className="text-lg font-bold py-4">LOADING</div>
          <div className="loading-bar shadow-lg rounded-full p-2">
  <div className="loading-progress rounded-full"></div>
</div>
    </div>
  )
}
export default LoadingScreen
