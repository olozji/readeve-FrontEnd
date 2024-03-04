'use client'
import { useEffect, useState } from "react";
import MapView from "./MapView";
import markerImage from '/public/images/marker1.png'
import { useRecoilState } from "recoil";
import { allReviewDataState } from "@/store/writeAtoms";
import { useSession } from "next-auth/react";
import axios from "axios";


interface ParamType {
  id: string

}

const MyMapPage = (props: ParamType) => {

  const session = useSession()

  let user: any = session.data?.user
  const [documents, setDocuments] = useState([]);
  const [allReviewData, setAllReviewData] = useRecoilState(allReviewDataState);
  const [myData, setMyData] = useState<any[]>([])
  
  const fetchData = async () => {
  
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/data/all/${props.id}`,
      )
      const data = response.data.data // 응답으로 받은 데이터
      setMyData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
}
useEffect(() => {
  fetchData()
}, [props.id])
    
    return (
        <div>
            {myData.length !== 0 ? (
            <MapView myMapData={myData} isShared={false} isFull={`100vh`} markerImage={markerImage}></MapView>
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