import Image from "next/image";
import mainLogo from "/public/images/mainLogo.png";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavBar from "@/app/components/NavBar";


const onBoarding = () => {
    return (

        <>
        <NavBar/>
        <div className="p-60 flex justify-center items-center">
            <div className="w-full mx-auto text-center flex flex-col items-center">
                <div className="pb-10">
                    <div className="w-[20vw] h-[0.8vh] bg-[#F1F1F1] rounded-xl">
                    <div className="w-[10vw] relative">
                        <div className="absolute left-0 top-0 h-full bg-[#E57C65]"></div>
                    </div>
                </div>
                </div>
        <div className="text-2xl font-bold">
            방해요소로 독서에 집중하기 어렵다면,<br/>
            외부 독서 장소를 찾아보세요!
        </div>
            <div className="p-20">
                <Image src={mainLogo} alt='mainLogo'/>
            </div>
            </div>
        </div>
        <div className="text-right">
            <ArrowForwardIcon style={{ color: '#E57C65' }} className="w-[10vw] h-[5vh] mb-10" />
        </div>
        </>
    )
}

export default onBoarding;
