'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContainer: React.FC = () => {
  
    useEffect(() => {
        const kakaoMapScript = document.createElement('script')
        kakaoMapScript.async = false
        kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=6d8ac2fb0740657f1e67a9163c8b331b&autoload=false`
        document.head.appendChild(kakaoMapScript)
      
        const onLoadKakaoAPI = () => {
          window.kakao.maps.load(() => {
            var container = document.getElementById('map')
            var options = {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667),
              level: 3,
            }
      
            var map = new window.kakao.maps.Map(container, options)
          })
        }
      
        kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
      }, [])

  return (
    <div>
      {/* 페이지 컨텐츠 및 지도를 표시할 컨테이너 */}
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      {/* 다른 페이지 컨텐츠 */}
    </div>
  );
};

export default MapContainer;
