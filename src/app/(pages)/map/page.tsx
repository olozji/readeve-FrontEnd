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
            const container = document.getElementById('map')
            const options = {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667),
              level: 3,
            }
      
            const map = new window.kakao.maps.Map(container, options);
            // 마커 생성
            const marker = new window.kakao.maps.Marker({ 
                position: map.getCenter(),
            }); 
          // 지도에 마커 표시
            marker.setMap(map);

            // 지도 클릭 이벤트 핸들러 등록
            window.kakao.maps.event.addListener(map, 'click', function(mouseEvent: { latLng: any; }) {
                // 클릭한 위도, 경도 정보 가져오기
                const latlng = mouseEvent.latLng; 
                
                // 마커 위치를 클릭한 위치
                marker.setPosition(latlng);
                
                let message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
                message += '경도는 ' + latlng.getLng() + ' 입니다';
                
                // 클릭한 위치 정보를 표시할 요소에 메시지를 추가.
                const resultDiv = document.getElementById('clickLatlng'); 
                if (resultDiv) {
                    resultDiv.innerHTML = message;
                }
            });
          })
        }
      
        kakaoMapScript.addEventListener('load', onLoadKakaoAPI);

      }, [])

  return (
    <div>
      {/* 페이지 컨텐츠 및 지도를 표시할 컨테이너 */}
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      
       {/* 클릭한 위치의 위도, 경도 정보를 표시 */}
      <div id="clickLatlng"></div>
    </div>
  );
};

export default MapContainer;