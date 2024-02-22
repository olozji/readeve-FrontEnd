'use client'

import ListItem from '@/app/components/listItem'
import { mapState } from '@/store/mapAtoms';
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';

interface MapDataType {
  myMapData: any[]
}

const MapView = ({ myMapData }: MapDataType) => {
  const [recoilMap, setRecoilMap] = useRecoilState<any>(mapState)
  const [map, setMap] = useState<any>();
  const [myPins, setMyPins] = useState([])
  function displayMarker(place: any, map: any) {
    // 마커를 생성하고 지도에 표시합니다
    let marker = new window.kakao.maps.Marker({
      map: map,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    })
    let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 })

    // 마커에 클릭이벤트를 등록합니다
    window.kakao.maps.event.addListener(marker, 'click', function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent(
        '<div style="padding:5px;font-size:12px;">' +
          place.place_name +
          '</div>',
      )
      infowindow.open(map, marker)
    })
  }
  const clickListItem = (place: any) => {
    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    if (map) {
      map.panTo(new window.kakao.maps.LatLng(place.y, place.x));
      map.setLevel(2);
      // setPlaceInfo(place)
    }
   
  };
  useEffect(() => {
    console.log(myMapData)
  }, [])
  useEffect(() => {
    setRecoilMap(map)
    console.log(recoilMap)
  }, [map])
  useEffect(() => {
    console.log(recoilMap)
  },[recoilMap])
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 2,
      }

      const mapInstance = new window.kakao.maps.Map(container, options)
      
      let bounds = new window.kakao.maps.LatLngBounds()
      // myMapData에 있는 데이터로 마커를 생성하여 지도에 추가
      myMapData.forEach((d: any) => {
        console.log(1)
        displayMarker(d.place, mapInstance)
        bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
      })
      mapInstance.setBounds(bounds)
      setMap(mapInstance)
      setRecoilMap(map)
      
    })
  }, [])
  

  return (
    <div>
      {myMapData.length !== 0 ? (
        <div>
          <div id="map" style={{ width: '100%', height: '400px' }}></div>
          {myMapData.map((data: any, i: number) => (
            <div onClick={() => console.log(1)}>
              {/* TODO::리스트 아이템에 온클릭 이벤트를 달아서 지도랑 리스트랑 상호작용하게 해야하는데 
              id='map' 인 div가 여기 있어서 컴포넌트로 분리가 안되네요 ㅜㅜ
              그래서 ListItem만 빼놨고,ListItem을 감싸고 있는 div에 온클릭이나 마우스 이벤트를 달아야 될거 같아요
              그리고 가능하시면 지도 위에 피그마처럼 띄워서 올리는거도 부탁드려요!
              PS. 정 안되면 저희 mapSearch에 있는 리스트 코드 잘 가져와서 쓰는게 나을거 같기도 합니다 */}
              <ListItem key={i} data={data}  />
              </div>
          ))}
        </div>
      ) : (
        <div>
          <div id="map" style={{ display: 'none' }}></div>
          <div>독서 기록을 남기고 지도를 확인하세요</div>
        </div>
      )}
    </div>
  )
}
export default MapView
