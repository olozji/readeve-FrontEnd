'use client';

import Image from "next/image";
import mainLogo from "/public/images/mainLogo.png";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavBar from "@/app/components/NavBar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import  Carousel  from 'react-material-ui-carousel';
import Button from "@/app/components/buttons/button";
import Footer from "@/app/components/footer";


const OnBoarding = () => {
    const [step, setStep] = useState(0);
    const router = useRouter();

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleRouter = () => {
        router.push('/')
    }

    const slides = [
        <div>방해요소로 독서에 집중하기 어렵다면,<br/> 외부 독서 장소를 찾아보세요!</div>,
        <div>내가 원하는 독서장소를 찾고,<br/>다른 독서장소를 추천 받아보세요!</div>,
        <div>다른 사람들의 독서장소는 어떨까?<br/> 읽는곳곳에서 독서장소를 공유해보세요!</div>
    ];

    const SlideContent = ({ title }: any) => {
        return (
          <div className="mt-20 flex justify-center items-center">
            <div className="w-full mx-auto text-center flex flex-col items-center">
              <div className="pb-10">
                <div
                  className="relative w-[10vw] h-[0.8vh] bg-[#F1F1F1] rounded-xl"
                >
                  <div
                    className="absolute left-0 top-0 h-full rounded-xl bg-[#E57C65] transition-all duration-500"
                    style={{ width: `${1 + (step + 1) * 3}vw`, backgroundColor:'##E57C65' }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold">{title}</div>
              <div className="p-20">
                <Image src={mainLogo} alt="mainLogo" />
              </div>
            </div>
          </div>
        );
      };

    return (
        <>
            <NavBar />
            <div className="p-[6.3rem]">
            <Carousel
                autoPlay={false}
                animation="slide"
                duration={800}
                index={step}
                onChange={(index:any) => setStep(index)}
                indicators={false}
                indicatorContainerProps={{ className: 'custom-indicator-container' }}
            >
                {slides.map((title, index) => (
                    <SlideContent key={index} title={title} />
                ))}
            </Carousel>
            <div className="flex justify-between">
                {step !== 0 && (
                    <div className="flex justify-between cursor-pointer" onClick={handlePrevStep}>
                        <ArrowBackIcon style={{ color: '#E57C65' }} className="w-[10vw] h-[5vh]" />
                    </div>
                )}
                 <div className="flex-grow"></div>
                <div className="" onClick={handleNextStep}>
                    {step < slides.length - 1 ? (
                        <ArrowForwardIcon style={{ color: '#E57C65' }} className="w-[10vw] h-[5vh] mb-10" />
                    ) : (
                        <div className="w-[10vw]">
                        <Button label={'이용해보기'} outline={true} onClick={handleRouter} />
                        </div>
                    )}
                </div>
            </div>
            </div>
        </>
    )
}

export default OnBoarding;
