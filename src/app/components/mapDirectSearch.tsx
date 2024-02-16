import { markersState } from '@/store/mapAtoms'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

declare global {
  interface Window {
    kakao: any
  }
}

export const MapDirectSearch = ({onMarkerClick}:any) => {
  const [map, setMap] = useState<any>()
  const [marker, setMarker] = useState<any>()
  const [address, setAddress] = useState('')

  const [markers, setMarkers] = useRecoilState(markersState);

    
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const currentPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude,
        )

        window.kakao.maps.load(() => {
          const container = document.getElementById('map')
          const options = {
            center: currentPosition, // 현재 위치를 지도의 중심으로 설정
            level: 3,
          }

          // 지도와 마커 초기화
          setMap(new window.kakao.maps.Map(container, options))
          setMarker(new window.kakao.maps.Marker())
          let currMarker = new window.kakao.maps.Marker({
            position: currentPosition,
          })
            currMarker.setMap(map)
        })
        
      },
      (error) => {
        console.error('Error getting current position:', error)
      },
    )
  }, [])

  // 2) 최초 렌더링 시에는 제외하고 map이 변경되면 실행
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
                onMarkerClick(addr);

                const newMarker = {
                  lat: mouseEvent.latLng.getLat(),
                  lng: mouseEvent.latLng.getLng(),
                  address: addr,
                };
  
                setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

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
      <div id="map" style={{ width: '50%', height: '400px' }}></div>
      <div onClick={getCurrentPosBtn}>현재 위치</div>
      <div>{address}</div>
    </div>
  )
}
