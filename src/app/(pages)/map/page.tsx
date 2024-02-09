'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContainer: React.FC = () => {

  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();
  
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
            setMap(map);
          })
        }
      
      
        kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
    }, [])
    const getPosSuccess = (pos: GeolocationPosition) => {
      // 현재 위치(위도, 경도) 가져온다.
      var currentPos = new window.kakao.maps.LatLng(
        pos.coords.latitude, // 위도
        pos.coords.longitude // 경도
      );
      // 지도를 이동 시킨다.
      let markerPosition = new window.kakao.maps.LatLng(currentPos); 
      
      map.panTo(currentPos);
      let marker = new window.kakao.maps.Marker({
        position: markerPosition
    });setMarker(currentPos);
  
      // 기존 마커를 제거하고 새로운 마커를 넣는다.
      marker.setMap(null);
      marker.setPosition(currentPos);
      marker.setMap(map);
    };
    const getCurrentPosBtn = () => {
      navigator.geolocation.getCurrentPosition(
        getPosSuccess,
        () => alert("위치 정보를 가져오는데 실패했습니다."),
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        }
      );
    }

  return (
    <div>
      {/* 페이지 컨텐츠 및 지도를 표시할 컨테이너 */}
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      {/* 다른 페이지 컨텐츠 */}
      <div onClick={getCurrentPosBtn}>현재 위치</div>
    </div>
  );
};

export default MapContainer;
