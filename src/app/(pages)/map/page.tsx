'use client'
import { useEffect, useState } from 'react'
import MapView from './[id]/MapView'
import markerImage from '/public/images/marker1.png'
import { useRecoilState } from 'recoil';
import { allReviewDataState } from '@/store/writeAtoms';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';



const SharedMapPage = () => {
  const [documents, setDocuments] = useState<any[]>([])
  const [allReviewData, setAllReviewData] = useRecoilState<any>(allReviewDataState);

  const params = useSearchParams();

  const placeIdParam = params!.get('placeId');

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.bookeverywhere.site/api/data/all?isPrivate=false',
      )
      const data = response.data.data // 응답으로 받은 데이터
  
      // 원본 배열을 복사하여 수정
      const newData = [...data]
  
      // 수정된 데이터를 상태에 반영
      setAllReviewData(newData)
    } catch (error) {
      console.error('Error fetching data:', error)

      
    }
  }

  // useEffect(() => {
  //   fetchData()
  // }, [])
  
  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    const filteredData = allReviewData.filter((d: any) => !d.pinRespDto.private)
    setDocuments(filteredData)
  },[allReviewData])

  return (
    <div>
      {documents.length !== 0 ? (
        <MapView myMapData={documents} isShared={true} isFull={`100vh`} markerImage={markerImage}  isMain={false} query={placeIdParam}></MapView>
      ) : (
        <div>
          <div id="map" style={{ display: 'none' }}></div>
          <div>독서 기록을 남기고 지도를 확인하세요</div>
        </div>
      )}
    </div>
  )
}

export default SharedMapPage
