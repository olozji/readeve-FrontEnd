'use client'
import { useEffect, useState } from "react";
import MapView from "./MapView";
import markerImage from '/public/images/marker1.png'
import { useRecoilState } from "recoil";
import { allReviewDataState } from "@/store/writeAtoms";




const MyMapPage = () => {
    const [allReviewData, setAllReviewData] = useRecoilState(allReviewDataState);
    
    return (
        <div>
            {allReviewData.length !== 0 ? (
            <MapView myMapData={allReviewData} isShared={false} isFull={`100vh`} markerImage={markerImage}></MapView>
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