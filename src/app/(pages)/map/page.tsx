'use client'
import { useEffect, useState } from 'react'
import MapView from './[id]/MapView'
import markerImage from '/public/images/marker1.png'
import { useRecoilState } from 'recoil';
import { allReviewDataState } from '@/store/writeAtoms';



const SharedMapPage = () => {
  const [documents, setDocuments] = useState<any[]>([])
  const [allReviewData, setAllReviewData] = useRecoilState(allReviewDataState);
  useEffect(() => {
    if (allReviewData) {
      const filteredData = allReviewData.filter((data: any) => !data.pinRespDto.private)
      setDocuments(filteredData)
    }
  }, [])

  return (
    <div>
      {documents.length !== 0 ? (
        <MapView myMapData={documents} isShared={true} isFull={`100vh`} markerImage={markerImage}  isMain={false}></MapView>
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
