'use client'
import { useEffect, useState } from 'react'
import MapView from './[id]/MapView'

const SharedMapPage = () => {
  const [documents, setDocuments] = useState<any[]>([])
  const [isShared, setIsShared] = useState(true);
  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo')

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      const filteredData = parsedData.filter((data: any) => !data.place.isPrivate)
      setDocuments(filteredData)
    }
  }, [])

  return (
    <div>
      {documents.length !== 0 ? (
        <MapView myMapData={documents} isShared={true} isFull={`calc(100vh - 44px)`}></MapView>
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
