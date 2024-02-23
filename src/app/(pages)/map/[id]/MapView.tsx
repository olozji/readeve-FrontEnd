'use client'

import ListItem from '@/app/components/listItem'
import { mapState } from '@/store/mapAtoms'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

interface MapDataType {
  myMapData: any[]
  isShared: boolean
  isFull: string
}

const MapView = ({ myMapData, isShared, isFull }: MapDataType) => {
  const mapRef = useRef<any>(null)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [infoWindows, setInfoWindows] = useState<any[]>([])

  const [filteredReviews, setFilteredReviews] = useState<any>([])
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // 한 번만 실행

  const displayMarker = (place: any, i: number) => {
    // 이미 생성된 마커가 있다면 해당 마커를 반환
    if (markers[i]) {
      markers[i].setMap(null) // 기존 마커를 지도에서 제거
    }

    // 새로운 마커 생성
    let newMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    })

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      zIndex: 1,
    })

    // 마커 클릭 이벤트 설정
    window.kakao.maps.event.addListener(newMarker, 'click', () => {
      console.log('Marker clicked:', place)
      setSelectedPlace(place)
      mapRef.current.setLevel(2)
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x))


      // 전체 독후감 데이터
      console.log(myMapData)

      // 필터링된 독후감 가져오기
      // place.id 값으로 필터링
      // TODO: 핀으로 검색하기(null) 인 경우 나중에 상태관리 필요함
      const filteredReviews = myMapData.filter(
        (data) => data.place.id === place.id,
      )
      // 독후감을 상태에 업데이트
      setFilteredReviews(filteredReviews)

      // 필터된 독후감 데이터
      console.log(filteredReviews)

      // Infowindow 열기
      infowindow.setContent(
        `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      )
      infowindow.open(mapRef.current, newMarker)
    })

    setMarkers((prevMarkers) => [...prevMarkers, newMarker])
    setInfoWindows((prevInfoWindows) => [...prevInfoWindows, infowindow])
  }

  const clickListItem = (place: any, i: number) => {
    console.log(place)
    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    if (mapRef.current) {
      mapRef.current.setLevel(2)
      openInfoWindow(place, i)
    }
  }

  const openInfoWindow = (place: any, i: number) => {
    
    if (infoWindows[i]) {
    infoWindows[i].open(mapRef.current, markers[i])
    mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x))
      
    }
  }

  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 2,
      }

      const mapInstance = new window.kakao.maps.Map(container, options)
      mapRef.current = mapInstance

      let bounds = new window.kakao.maps.LatLngBounds()

      const markerList: Record<string, any> = {}

      // myMapData에 있는 데이터로 마커를 생성하여 지도에 추가
      myMapData.forEach((d: any, i: number) => {
        console.log(1)
        displayMarker(d.place, i)
        bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))

        mapInstance.setBounds(bounds)

      })
    })
  }, [myMapData])

  //TODO:여기서 44 는 NavBar 높이인데 브라우져나 해상도에 따라 다르게 나올거 같아서 수정해야해요
  const mapHeight = isFull === `calc(100vh - 44px)` ? windowHeight - 44 : 400
  return (
    <div style={{ position: 'relative' }}>
      {myMapData.length !== 0 ? (
        <div>
          <div
            id="map"
            className=''
            style={{ width: '100%', height: `${isFull}`, position: 'relative' }}
          >
            {/* 스크롤 구현 TODO:스크롤바 스타일링 or 없애기*/}
            <div className='p-10  overflow-y-auto no-scrollbar' style={{ position: 'absolute', height: `${mapHeight}px`, zIndex: 10 }}>
              {filteredReviews.length === 0
                ? myMapData.map((data: any, i: number) => (
                    <div key={i}>
                      <ListItem
                        key={i}
                        index={i}
                        data={data}
                        onListItemClick={() => {
                          clickListItem(data.place, i)
                        }}
                        isShared={isShared}
                      />
                    </div>
                  ))
                : filteredReviews.map((data: any, i: number) => (
                    <div key={i}>
                      <ListItem
                        key={i}
                        index={i}
                        data={data}
                        onListItemClick={() => {
                          clickListItem(data.place, i)
                        }}
                        isShared={isShared}
                      />
                    </div>
                  ))}
            </div>
            {/* 뒤에 흰 배경*/}
            <div style={{ position: 'absolute', top: 0, left: 30, width: '32%', height: '100%', background: 'rgba(255, 0, 255, 0.8)', zIndex: 2 }}></div> 
          </div>
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
