
import NavBar from "../NavBar";
import Footer from "../footer";



const LayOut = (props:any) => {
    return (
        <div className="min-h-full">
        
        <div className="mx-auto">
            <main>{props.children}</main>
        <Footer/>
        </div>
    </div>
    )
}

export default LayOut;