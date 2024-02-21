'use client'

import { useEffect, useState } from 'react'

interface MapDataType {
  myMapData: any[]
}

const MapView = ({ myMapData }: MapDataType) => {
  const [myMap, setMyMap] = useState()
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
  useEffect(() => {
    console.log(myMapData)
  }, [])
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 2,
      }

      const mapInstance = new window.kakao.maps.Map(container, options)
      setMyMap(mapInstance)
      let bounds = new window.kakao.maps.LatLngBounds()
      // myMapData에 있는 데이터로 마커를 생성하여 지도에 추가
      myMapData.forEach((d: any) => {
        console.log(1)
        displayMarker(d.place, mapInstance)
        bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
      })
      mapInstance.setBounds(bounds)
    })
  }, [])

  return (
    <div>
      {myMapData.length !== 0 ? (
        <div id="map" style={{ width: '100%', height: '400px' }}></div>
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
