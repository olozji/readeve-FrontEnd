'use client'
import NavBar from "@/app/components/NavBar";
import BookLayoutItem from "../BookLayoutItem"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import lampIcon from '/public/images/lampicon.png'
import Image from "next/image";
import { GoBackButton } from "@/app/components/buttons/goBackButton";

export interface PropType {
  params: {
    id: string
    searchParams: {}
  }
}

const Detail = (props: PropType) => {
  const session: any = useSession()

  const [myData, setMyData] = useState([])
  const [myPageData,setMyPageData] = useState<any>([])

  const fetchData = async () => {
    if (session.data.user.id) {
      try {
        const response = await axios.get(
          `https://api.bookeverywhere.site/api/data/all/${session.data.user.id}`,
        );
        const data = response.data.data;
        setMyData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    }
  }
  useEffect(() => {
    fetchData()
  }, [session])
 

  useEffect(() => {
    setMyPageData(myData)
  }, [myData])

  return (
    <><NavBar />
      <section className={`bg-[#F1E5CF] px-[15vw] sm:px-0 mx-auto h-screen`}>
      <div className='absolute py-20 sm:hidden'>
        <GoBackButton/> 
      </div>
      {/* 램프&내 서재 */}
      <div className="grid relative mx-auto justify-center text-center mb-10">
        <Image
          src={lampIcon}
          className="inline-block text-center"
          alt={'lampIcon'}
          width={150}
          height={100}
        />
        <div>
        <div className="absolute bottom-8 left-0 right-0 mx-auto myCustomText text-3xl text-white">내 서재</div>
        </div>
        </div>
       
   {myData.length > 0 && (
    <div className="overflow-y-auto max-h-[90vh]">
      <BookLayoutItem bookId={props.params.id} propsData={myData} />
      </div>
        )}
         </section>
      </>
  )
}

export default Detail;