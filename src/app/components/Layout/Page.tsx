import NavBar from "../NavBar";



const LayOut = (props:any) => {
    return (
        <div className="min-h-full">
        <NavBar/>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <main>{props.children}</main>
        </div>
    </div>
    )
}

export default LayOut;