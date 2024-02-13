'use client';

import { markersState } from '@/store/mapAtoms'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

declare global {
  interface Window {
    kakao: any
  }
}

const myPage = () => {
  const [map, setMap] = useState<any>()
  const [marker, setMarker] = useState<any>()
  const [address, setAddress] = useState('')

  // 저장된 지도의 마크 데이터를 꺼내와 쓰기
  const markers = useRecoilValue(markersState);

    
  //초기값이 false 여서 처음 마운트될때는 실행 안 되는 useEffect인 커스텀 훅 이에요  
  const useDidMountEffect = (func: any, deps: any) => {
    const didMount = useRef(false)

    useEffect(() => {
      if (didMount.current) func()
      else didMount.current = true
    }, deps)
  }

    // 1) 카카오맵 불러오기
    // 올려주신거 그대로 구현하려고 script태그를 app/layout.tsx에 삽입해서 지도 띄웠어요!
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      }

      setMap(new window.kakao.maps.Map(container, options))
      setMarker(new window.kakao.maps.Marker())
    })
  }, [])

  // 페이지 로드 시 리코일 value로 저장된 마커를 지도에 표시
  useDidMountEffect(() => {
    if (map && markers.length > 0) {
      // 이전에 추가된 마커들을 제거
      markers.forEach((m: any) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(m.lat, m.lng),
          map: map,
        });
      });
    }
  }, [map, markers]);


  
  useDidMountEffect(() => {
    if (map) { 
      window.kakao.maps.event.addListener( //이 부분이 nextjs에서 useEffect를 사용해 마운트한 카카오맵을 인식 못해서 리스너가 안 달렸는데
        map,                               //if(map)으로 map 이 null이 아닐때만 실행 하니까 해결 됐어요
        'click',
        function (mouseEvent: any) {
          // 주소-좌표 변환 객체를 생성합니다
          let geocoder = new window.kakao.maps.services.Geocoder()

          geocoder.coord2Address(
            mouseEvent.latLng.getLng(),
            mouseEvent.latLng.getLat(),
            (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                let addr = !!result[0].road_address
                  ? result[0].road_address.address_name
                  : result[0].address.address_name

                // 클릭한 위치 주소를 가져온다.
                setAddress(addr)

                const newMarker = {
                    lat: mouseEvent.latLng.getLat(),
                    lng: mouseEvent.latLng.getLng(),
                    address: addr,
                  };
    
                  setMarker((prevMarkers:any) => [...prevMarkers, newMarker]);

                // 기존 마커를 제거하고 새로운 마커를 넣는다.
                marker.setMap(null)
                // 마커를 클릭한 위치에 표시합니다
                marker.setPosition(mouseEvent.latLng)
                marker.setMap(map)
              }
            },
          )
        },
      )
    }
  }, [map])

    
 //---------------------현재 위치 가져오기---------------------------//

  const getPosSuccess = (pos: GeolocationPosition) => {
    // 현재 위치(위도, 경도) 가져온다.
    let currentPos = new window.kakao.maps.LatLng(
      pos.coords.latitude, // 위도
      pos.coords.longitude, // 경도
    )
    console.log(currentPos)

    // 지도를 이동 시킨다.
    var geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.coord2Address(
      currentPos.La, //현재위도
      currentPos.Ma, //현재경도
      (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          let addr = !!result[0].road_address
            ? result[0].road_address.address_name
            : result[0].address.address_name

          // 클릭한 위치 주소를 가져온다.
          setAddress(addr)
          

          // 기존 마커를 제거하고 새로운 마커를 넣는다.
          marker.setMap(null)
          map.panTo(currentPos)
          // 마커를 클릭한 위치에 표시합니다
          marker.setPosition(currentPos)
          marker.setMap(map)
        }
      },
    )
  }

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
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <div onClick={getCurrentPosBtn}>현재 위치</div>
      <div>{address}</div>
      
      {/* 저장된 데이터가 잘 뜨는지 확인용  */}
      <div>
        <h2>저장된 마커</h2>
        {markers.map((m, index) => (
          <div key={index}>
            <p>위도: {m.lat}</p>
            <p>경도: {m.lng}</p>
            <p>주소: {m.address}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default myPage;