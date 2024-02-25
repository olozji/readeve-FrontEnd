import NavBar from "../NavBar";



const LayOut = (props:any) => {
    return (
        <div className="min-h-full">
        <NavBar/>
        <div className="mx-auto ">
            <main>{props.children}</main>
        </div>
    </div>
    )
}

export default LayOut;