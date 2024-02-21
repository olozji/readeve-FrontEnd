'use client'
import { useEffect, useState } from "react";
import MapView from "./MapView";

const MyMapPage = () => {
    const [documents, setDocuments] = useState<any[]>([])
    useEffect(() => {
        const storedData = localStorage.getItem('allDataInfo')
    
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          setDocuments(parsedData)
        }
    }, [])
    
    return (
        <div>
            {documents.length !== 0 ? (
            <MapView myMapData={documents}></MapView>
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