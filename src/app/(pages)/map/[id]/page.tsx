'use client'
import { useEffect, useState } from "react";
import MapView from "./MapView";
import markerImage from '/public/images/marker1.png'
import { useRecoilState } from "recoil";
import { allReviewDataState } from "@/store/writeAtoms";
import { useSession } from "next-auth/react";
import axios from "axios";


export interface PropType {
  params: {
    id: string
    searchParams: {}
  }
}
const MyMapPage = (props: PropType) => {

  const [myData, setMyData] = useState<any[]>([])
  const [myPageData,setMyPageData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true);
  let session: any = useSession();

  const fetchData = async () => {
  
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/data/all/${props.params.id}`,
      )
      const data = response.data.data // 응답으로 받은 데이터
      setMyData(data)
      console.log(myData)
      
    } catch (error) {
      console.error('Error fetching data:', error)
      console.log(myData)
      console.log(props.params.id)
    }finally {
      setIsLoading(false);
    }
  }
  


  
  useEffect(() => {
      fetchData()
  }, [props.params.id,session])
  
  useEffect(() => {
    setMyPageData(myData)
  }, [myData])


    
    return (
        <div>
            {myPageData&&myPageData.length !== 0 ? (
            <MapView myMapData={myPageData} isShared={false} isFull={`100vh`} markerImage={markerImage}></MapView>
          ) : (
            <div>
              <div id="map" style={{ display: 'none' }}></div>
              <div>독서 기록을 남기고 지도를 확인하세요</div>
            </div>
          )}
        </div>
    )
};

export default MyMapPage