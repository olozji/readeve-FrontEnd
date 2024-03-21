import { Viewport } from "next";
import NavBar from "../NavBar";
import Footer from "../footer";


export const viewPort: Viewport = {
    width: 'divice-width',
    initialScale: 1,
    userScalable: false,
    maximumScale:1
  }
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