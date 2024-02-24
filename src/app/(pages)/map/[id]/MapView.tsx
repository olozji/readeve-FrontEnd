'use client'

import ListItem from '@/app/components/listItem'
import { mapState } from '@/store/mapAtoms'
import { tagState } from '@/store/writeAtoms'
import { dividerClasses } from '@mui/material'
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
  const [tagInfo] = useRecoilState(tagState)
  const [isSelectedTags, setIsSelectedTags] = useState<boolean[]>(
    new Array(tagInfo.length).fill(false),
  )
  const [startIdx, setStartIdx] = useState(0)
  const numVisibleTags = 3 // 표시할 최대 태그 개수

  const [filteredReviews, setFilteredReviews] = useState<any>([])
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    if (isShared) {
      console.log(3)
      // 선택된 태그의 이름을 배열로 모읍니다.
      const tagFilteredReviews = myMapData.filter((data) => {
        const selectedTagsIndexes = isSelectedTags
          .map((selected, index) => (selected ? index : -1))
          .filter((index) => index !== -1)

        return selectedTagsIndexes.every((selectedIndex) =>
          data.tags.some(
            (tag: any) =>
              tag.selected && tag.name === tagInfo[selectedIndex].name,
          ),
        )
      })

      setFilteredReviews(tagFilteredReviews)
      console.log(filteredReviews)
    }
  }, [isSelectedTags]) // 한 번만 실행
  const handleClickPrev = () => {
    setStartIdx(Math.max(startIdx - numVisibleTags, 0))
  }

  const handleClickNext = () => {
    setStartIdx(Math.min(startIdx + numVisibleTags, tagInfo.length - 1))
  }

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
      if (!isShared) {
        const filteredReviews = myMapData.filter(
          (data) => data.place.id === place.id,
        )
        // 독후감을 상태에 업데이트
        setFilteredReviews(filteredReviews)
      }

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
  const searchTag = (i: number) => {
    let copy = [...isSelectedTags] // 이전 배열의 복사본을 만듦
    copy[i] = !copy[i] // 복사본을 변경
    setIsSelectedTags(copy) // 변경된 복사본을 상태로 설정
    console.log(isSelectedTags) // 변경된 상태를 확인
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
            className=""
            style={{ width: '100%', height: `${isFull}`, position: 'relative' }}
          >
            {/* 스크롤 구현 TODO:스크롤바 스타일링 or 없애기*/}
            <div
              className="p-10  overflow-y-auto no-scrollbar"
              style={{
                position: 'absolute',
                height: `${mapHeight}px`,
                zIndex: 10,
              }}
            >
              {filteredReviews.length === 0 ? (
                isShared ? (
                  <div className="ml-16">
                    선택된 태그에 해당하는 장소가 없습니다
                  </div>
                ) : (
                  myMapData.map((data: any, i: number) => (
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
                )
              ) : (
                filteredReviews.map((data: any, i: number) => (
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
              )}
            </div>
            {/* 뒤에 흰 배경*/}
            {isShared && (
              <div className="absolute top-0 left-20 z-40 flex flex-row rounded-lg">
                <div className="p-2 cursor-pointer" onClick={handleClickPrev}>
                  &lt;
                </div>
                {tagInfo
                  .slice(startIdx, startIdx + numVisibleTags)
                  .map((tag: any, i: number) => (
                    <div
                      key={i}
                      className={`p-2 mx-2 rounded-lg bg-yellow-200 ${isSelectedTags[startIdx + i] && 'bg-emerald-200'}`}
                      onClick={() => searchTag(startIdx + i)}
                    >
                      {tag.name}
                    </div>
                  ))}
                <div className="p-2 cursor-pointer" onClick={handleClickNext}>
                  &gt;
                </div>
                
                {/* TODO:선택된 태그 보여줄 때 버그 수정 */}
                {tagInfo.map(
                  (tag: any, i: number) =>
                    isSelectedTags[i] && (
                      <div
                        key={i}
                        className={`p-2 mx-2 rounded-lg bg-emerald-200`}
                        onClick={() => searchTag(startIdx + i)}
                      >
                        {tag.name}
                      </div>
                    ),
                )}
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 30,
                width: '32%',
                height: '100%',
                background: 'rgba(255, 0, 255, 0.8)',
                zIndex: 2,
              }}
            ></div>
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
