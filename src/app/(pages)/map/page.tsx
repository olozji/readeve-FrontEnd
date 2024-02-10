'use client'

import React, { useEffect, useState } from 'react';
import logo from '/public/images/logo.png';

declare global {
  interface Window {
    kakao: any
  }
}


const MapContainer: React.FC = () => {
  const [mainMap, setMainMap] = useState<any>();
  const [mainMarker, setMainMarker] = useState<any>();
  const [isMarkersVisible, setIsMarkerVisible] = useState(true);


    // 마커 감추기
    const hideMarkers = () => {
      setIsMarkerVisible(false);
    }
  
    // 마커 보이기
    const showMarkers = () => {
      setIsMarkerVisible(true);
    }
  


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

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);

        // 생성된 마커들을 저장할 배열
        const markerList : any[] = [];


         // 이미지 마커 생성
         const markerImage = new window.kakao.maps.MarkerImage(
          logo.src,
          new window.kakao.maps.Size(30,30),
          { offset : new window.kakao.maps.Point(15,30)}
        )

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
          image:markerImage,
        });

        // 마커클릭 시 인포윈도우 내용 
        // TODO: 나중에 커스컴 할 부분!
        const iwContent = `<div>변환된 주소</div>`,
              iwRemoveable = true;

        // 마커 인포윈도우 설정 
        const infowindow = new window.kakao.maps.InfoWindow({
          content : iwContent,
          removable : iwRemoveable
      });      

        window.kakao.maps.event.addListener(
          map,
          'click',
          async function (mouseEvent: { latLng: any }) {
            // 클릭한 위도, 경도 정보 가져오기
            const latlng = mouseEvent.latLng;


            // 클릭한 위치에 마커 생성
            const clickMarker = new window.kakao.maps.Marker({
              position: latlng,
              map: isMarkersVisible ? map : null,
              image:markerImage,
            });
            
            markerList.push(clickMarker);

            // 마커 위치를 클릭한 위치
            marker.setPosition(latlng);

           
            // 마커 인포윈도우 생성
            infowindow.open(map, marker);
    
            let message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, '
            message += '경도는 ' + latlng.getLng() + ' 입니다'
    
            // 클릭한 위치 정보를 표시할 요소에 메시지를 추가.
            const resultDiv = document.getElementById('clickLatlng')
            if (resultDiv) {
              resultDiv.innerHTML = message
            }
          },
        )

        marker.setMap(map);
        setMainMap(map)
        setMainMarker(marker)
      })
    }
    // 지도 클릭 이벤트 핸들러 등록
    kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
  }, []);



  const getPosSuccess = (pos: GeolocationPosition) => {
    // 현재 위치(위도, 경도) 가져온다.
    let currentPos = new window.kakao.maps.LatLng(
      pos.coords.latitude, // 위도
      pos.coords.longitude, // 경도
    )
    console.log(currentPos);

    // 지도를 이동 시킨다.
    let markerPosition = new window.kakao.maps.LatLng(currentPos)

    mainMap.panTo(currentPos)

    // 이미지 마커 생성
    const markerImage = new window.kakao.maps.MarkerImage(
     logo.src,
      new window.kakao.maps.Size(30,30),
    )

    // 현위치 마커 생성
    let currmarker = new window.kakao.maps.Marker({
      position: markerPosition,
      image:markerImage,
    })
    setMainMarker(currmarker)

    // 기존 마커를 제거하고 새로운 마커를 넣는다.
    mainMarker.setMap(null)
    mainMarker.setPosition(currentPos)
    mainMarker.setMap(mainMap)
  }

  // 현재 위치 가져오기
  const getCurrentPosBtn = () => {
    navigator.geolocation.getCurrentPosition(
      getPosSuccess,
      () => alert('위치 정보를 가져오는데 실패했습니다.'),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      },
    )
  }

  return (
    <div>
      {/* 페이지 컨텐츠 및 지도를 표시할 컨테이너 */}
      <div id="map" style={{ width: '100%', height: '400px' }}></div>

      {/* 마커 정보를 표시 */}


      {/* 다른 페이지 컨텐츠 */}

      <div onClick={getCurrentPosBtn}>현재 위치</div>
      <div>
        <button onClick={hideMarkers}>마커 감추기</button>
        <button onClick={showMarkers}>마커 보이기</button>
      </div>
      
      {/* 클릭한 위치의 위도, 경도 정보를 표시 */}
      
      <div id="clickLatlng"></div>
    </div>
  )
}

export default MapContainer
