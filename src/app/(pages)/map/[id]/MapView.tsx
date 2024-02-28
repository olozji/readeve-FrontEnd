'use client'

import ListItem from '@/app/components/listItem'
import { mapState } from '@/store/mapAtoms'
import { mainTagState, tagState } from '@/store/writeAtoms'
import { dividerClasses } from '@mui/material'
import { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

import Rectangle from '/public/images/Rectangle.png'
import sharedMarker from '/public/images/sharedMarker.png'

import { Tag } from '@/app/components/tags'

interface MapDataType {
  myMapData: any[]
  isShared: boolean
  isFull: string
  markerImage: StaticImageData
  isMain: boolean
  markerImageOpacity: StaticImageData
}

const MapView = ({
  myMapData,
  isShared,
  isFull,
  markerImage,
  isMain,
  markerImageOpacity,
}: MapDataType) => {
  const mapRef = useRef<any>(null)
  const listContainerRef = useRef<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [overlay, setOverlay] = useState<any[]>([])
  const [tagInfo] = useRecoilState(tagState)
  const [isSelectedTags, setIsSelectedTags] = useRecoilState(mainTagState)
  const [startIdx, setStartIdx] = useState(0)
  const numVisibleTags = 5 // 표시할 최대 태그 개수

  const [filteredReviews, setFilteredReviews] = useState<any>([])
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [isTitleActive, setIsTitleActive] = useState('최근기록')
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<string>('');


  useEffect(() => {
    if (isShared) {
     
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
    setStartIdx(Math.min(startIdx + numVisibleTags, tagInfo.length - startIdx))
  }

  const displayMarker = (place: any, i: number, data?: any) => {
    function closeOverlay(i:number) {
      overlay[i].setMap(null);     
  }
    // 이미 생성된 마커가 있다면 해당 마커를 반환
    if (markers[i]) {
      markers[i].setMap(null); // 기존 마커를 지도에서 제거
      closeOverlay(i)
    }
    
    // 공유지도 일때와 개인지도 일때 마커 설정
    let markerImageProps
    if (isShared) {
      markerImageProps = new window.kakao.maps.MarkerImage(
        sharedMarker.src || '',
        new window.kakao.maps.Size(40, 40),
      )
    } else {
      markerImageProps = new window.kakao.maps.MarkerImage(
        markerImage?.src || '',
        new window.kakao.maps.Size(30, 30),
      )
    }

    // 새로운 마커 생성
    let newMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(place.y, place.x),
      image: markerImageProps,
    })

    //   const content = document.createElement('div');
    // content.innerHTML = `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`;

    var content = document.createElement('div')
    if (isShared) {
      if (isMain) {
        //공유지도 메인화면 인포윈도우
        content.innerHTML = `<div class="marker_overlay shadow">
    <div class="place_name text-primary">${place.place_name}</div>
    <div class="place_address">${place.address}</div>
</div>`
      } else {
        //공유지도 큰화면 인포윈도우
        content.innerHTML = `<div class="marker_overlay shadow">
    <div class="place_name text-primary">${place.place_name}</div>
    <div class="place_address">${place.address}</div>
    <hr>
    ${data && data.map((tag: any, i: number) => tag.selected && `<div class="tag">${tag.name}</div>`).filter(Boolean).join(``)}
    <div class="theme_name"></div>
</div>`
      }
    } else {
      //개인지도 인포윈도우
      content.innerHTML = `<div class="marker_overlay_isPrivate shadow">
      <div class="place_address">${place.address}</div>
    <div class="place_name text-primary">${place.place_name}</div>
    
    <hr>
    <div class="theme_name"></div>
</div>`
    }
    
    
    let yAnchor;
    if (isMain) {
        yAnchor = 1.7;
    } else {
        yAnchor = 1.4;
    }
    
    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(place.y, place.x),
      content: content,
      zIndex: 2,
      yAnchor: yAnchor
    })

    // 마커 클릭 이벤트 설정
    window.kakao.maps.event.addListener(newMarker, 'click', () => {
      if (overlay.length !== 0) {
        console.log(1)
        overlay.forEach((o:any) => {
          o.setMap(null)
        })
      }
      console.log('Marker clicked:', place)
      setSelectedPlace(place)
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x))

      // 전체 독후감 데이터
      console.log(myMapData)

      // 최근 기록에서 나의 기록으로 변경
      setIsTitleActive(`${place.place_name}에서 읽은 독후감`)

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


     
      setIsTitleActive(`${place.place_name}에서 읽은 독후감`)

    })

    const handleMarkerClick = (id:string) => {
      const listItem = document.getElementById(`list-item-${id}`)
      console.log(id);
      if(listItem && listContainerRef.current){
        const offsetTop = listItem.offsetTop - listContainerRef.current.offsetTop;
        listContainerRef.current.scrollTo({top: offsetTop, behavior: 'smooth'})
      }
      setSelectedMarkerIndex(id)
    }

    window.kakao.maps.event.addListener(newMarker, 'click', () => {
      handleMarkerClick(place.id)
    })



    window.kakao.maps.event.addListener(newMarker, 'mouseover', () => {
      customOverlay.setMap(mapRef.current, newMarker)

    })
    window.kakao.maps.event.addListener(newMarker, 'mouseout', () => {
      customOverlay.setMap(null)

    })

    setMarkers((prevMarkers) => [...prevMarkers, newMarker])
    setOverlay((prevOverlay) => [...prevOverlay, customOverlay])
  }

  const searchTag = (i: number) => {
    let copy = [...isSelectedTags] // 이전 배열의 복사본을 만듦
    copy[i] = !copy[i] // 복사본을 변경
    setIsSelectedTags(copy) // 변경된 복사본을 상태로 설정
  }

  const clickListItem = (place: any, i: number) => {
    console.log(place)

    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    if (mapRef.current) {
      mapRef.current.setLevel(2)
      openCustomOverlay(place, i)
    }
  }

  //TODO:리스트를 클릭했을 때 마커의 이미지를 바뀌게 할지? 모르겠어서 주석처리 했습니다
  // const clickListItem = (place: any, i: number) => {
  //   if (mapRef.current) {
  //     mapRef.current.setLevel(2)
  //      openInfoWindow(place, i)
  //     // 이전에 선택된 마커가 있다면 기존 마커의 이미지를 markerImageOpacity로 변경
  //     if (selectedPlace) {
  //       const selectedMarkerIndex = myMapData.findIndex((data) => data.place.id === selectedPlace.id);
  //       if (selectedMarkerIndex !== -1 && markers[selectedMarkerIndex]) {
  //         markers[selectedMarkerIndex].setImage(new window.kakao.maps.MarkerImage(
  //           markerImage.src,
  //           new window.kakao.maps.Size(30, 30),
  //         ));
  //       }
  //     }
  //     displayMarker(place, i);

  //   }
  // }

  const openCustomOverlay = (place: any, i: number) => {
    if (overlay[i]) {
      overlay[i].setMap(mapRef.current, markers[i])
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x))
    }
  }

  useEffect(() => {
    if (isShared) {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords
          const currentPosition = new window.kakao.maps.LatLng(
            latitude,
            longitude,
          )
          const container = document.getElementById('map')
          const options = {
            center: currentPosition,
            level: 8,
          }
  
          const mapInstance = new window.kakao.maps.Map(container, options)
          mapRef.current = mapInstance
  
          let bounds = new window.kakao.maps.LatLngBounds()
  
          const markerList: Record<string, any> = {}
  
          // myMapData에 있는 데이터로 마커를 생성하여 지도에 추가
          if (filteredReviews.length === 0) {
            myMapData.forEach((d: any, i: number) => {
              displayMarker(d.place, i, d.tags)
              // bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
  
              // mapInstance.setBounds(bounds)
            })
          } else {
            filteredReviews.forEach((d: any, i: number) => {
              displayMarker(d.place, i, d.tags)
              bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
  
              mapInstance.setBounds(bounds)
            })
          }

         })
        // const getPosSuccess = (pos: GeolocationPosition) => {
        //   // 현재 위치(위도, 경도) 가져온다.
        //   var currentPos = new window.kakao.maps.LatLng(
        //     pos.coords.latitude, // 위도
        //     pos.coords.longitude // 경도
        //   );
        //   // 지도를 이동 시킨다.
    
        //   mapRef.current.panTo(currentPos);
          
        // };
        // const getCurrentPosBtn = () => {
        //   navigator.geolocation.getCurrentPosition(
        //     getPosSuccess,
        //     () => alert("위치 정보를 가져오는데 실패했습니다."),
        //     {
        //       enableHighAccuracy: true,
        //       maximumAge: 30000,
        //       timeout: 27000,
        //     }
        //   );
        // }
        
      })
    }
  }, [filteredReviews])

  useEffect(() => {
    window.kakao.maps.load(() => {
      if (!isShared) {
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 2,
      }

      const mapInstance = new window.kakao.maps.Map(container, options)
      mapRef.current = mapInstance

      // let bounds = new window.kakao.maps.LatLngBounds()

      const markerList: Record<string, any> = {}

      // myMapData에 있는 데이터로 마커를 생성하여 지도에 추가
     
        myMapData.forEach((d: any, i: number) => {
          displayMarker(d.place, i)
          // bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
          if (i == myMapData.length - 1) {
            mapRef.current.setLevel(6)
            mapRef.current.panTo(new window.kakao.maps.LatLng(d.place.y, d.place.x))
          }
        

          // mapInstance.setBounds(bounds)
        })
      }
    })
  }, [myMapData])

  //TODO:여기서 44 는 NavBar 높이인데 브라우져나 해상도에 따라 다르게 나올거 같아서 수정해야해요
  const mapHeight = isFull === `calc(100vh - 44px)` ? windowHeight - 44 : 400
  return (
    <div style={{ position: 'relative' }}>
      {myMapData.length !== 0 ? (
        <div
          className="
        relative
       "
          style={{
            background: '#f9f9f9',
            zIndex: 2,
          }}
        >
          <div>
            <div
              id="map"
              className={`${isFull !== `calc(100vh - 44px)` ? 'rounded-lg' : ''}`}
              style={{
                width: '100%',
                height: `${isFull}`,
                position: 'relative',
              }}
            >
              {/* 스크롤 구현 TODO:스크롤바 스타일링 or 없애기*/}

              {!isMain && (
                <div
                  className=""
                  style={{
                    position: 'absolute',
                    height: `${mapHeight}px`,
                    zIndex: 10,
                  }}
                >
                  {/* TODO: 스크롤 내용 수정 */}

                  <div
                    ref={listContainerRef}
                    className="absolute scrollBar w-[35rem] bg-[#f9f9f9] h-full px-[4rem] py-[2rem] bg-opacity-80 overflow-y-auto rounded-lg"
                    style={{ zIndex: 2 }}
                  >
                    <h1 className="font-bold">{isTitleActive}</h1>

                    {filteredReviews.length === 0 ? (
                      isShared ? (
                        <div className="ml-16">
                          선택된 태그에 해당하는 장소가 없습니다
                        </div>
                      ) : (
                        myMapData.map((data: any, i: number) => (
                          <div 
                            key={i}
                            id={`list-item-${data.place.id}`} 
                            >
                            <ListItem
                              key={i}
                              index={i}
                              data={data}
                              selectedMarkerIndex={selectedMarkerIndex}
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
                        <div 
                        key={i}
                        id={`list-item-${data.place.id}`} 
                        >
                          <ListItem
                            key={i}
                            index={i}
                            data={data}
                            selectedMarkerIndex={selectedMarkerIndex}
                            onListItemClick={() => {
                              clickListItem(data.place, i)
                            }}
                            isShared={isShared}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              {isMain && (
                <Link
                  href={'/map'}
                  className="absolute text-2xl font-bold top-2 right-2  z-40  bg-white p-4 rounded-full"
                >
                  <div className="absolute top-0 right-2">+</div>
                </Link>
              )}
              {/* 뒤에 흰 배경*/}
              {isShared && (
                <div className="absolute top-6 left-1/3 transform -translate-x-1/5 z-40 flex flex-row rounded-lg">
                  {!isMain && (
                    <div
                      className="p-2 cursor-pointer"
                      onClick={handleClickPrev}
                    >
                      &lt;
                    </div>
                  )}
                  {!isMain &&
                    tagInfo
                      .slice(startIdx, startIdx + numVisibleTags)
                      .map((tag: any, i: number) => (
                        <div
                          key={i}
                          className={`box-border flex flex-row justify-center text-sm items-center px-4 py-2 mx-2 border border-gray-300 rounded-full  ${isSelectedTags[startIdx + i] ? 'bg-[#E57C65] text-white' : 'bg-white hover:border-[#C05555] hover:text-[#C05555]'}`}
                          onClick={() => searchTag(startIdx + i)}
                        >
                          {tag.name}
                        </div>
                      ))}
                  {!isMain && (
                    <div
                      className="p-2 cursor-pointer"
                      onClick={handleClickNext}
                    >
                      &gt;
                    </div>
                  )}

                  {/* TODO:선택된 태그 보여줄 때 버그 수정 */}
                  {/* {tagInfo.map(
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
                )} */}
                </div>
              )}
            </div>
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
