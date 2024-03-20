'use client'

import ListItem from '@/app/components/listItem'
import { mainTagState, tagState } from '@/store/writeAtoms'
import { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import sharedMarker from '/public/images/sharedMarker.png'

import { GoBackButton } from '@/app/components/buttons/goBackButton'
import { useSession } from 'next-auth/react'
import LoadingScreen from '@/app/components/loadingScreen'

interface MapDataType {
  myMapData: any[]
  isShared: boolean
  isFull: string
  markerImage: StaticImageData
  isMain?: boolean
  query?: any;
}

const MapView = ({
  myMapData,
  isShared,
  isFull,
  markerImage,
  isMain,
  query,
}: MapDataType) => {
  const mapRef = useRef<any>(null)
  const listContainerRef = useRef<any>(null)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [overlay, setOverlay] = useState<any[]>([])
  const [tagInfo] = useRecoilState(tagState)
  const [isSelectedTags, setIsSelectedTags] = useRecoilState(mainTagState)
  const [startIdx, setStartIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [numVisible, setNumVisible] = useState(5) // 기본값은 2개의 책
  const [numVisibleTags, setNumVisibleTags] = useState(1)

  const [filteredReviews, setFilteredReviews] = useState<any>([])
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  const [isTitleActive, setIsTitleActive] = useState(
    `${isShared ? '태그별 목록' : '최근 기록'}`,
  )

  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<string>('')

  let session = useSession()
  let user: any = session.data?.user

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
              tag.selected && tag.content === tagInfo[selectedIndex].content,
          ),
        )
      })

      setFilteredReviews(tagFilteredReviews)
      console.log(filteredReviews)
    }
  }, [isSelectedTags]) // 한 번만 실행

  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth
      if (screenWidth < 819) {
        setNumVisible(2) // 화면이 작을 때
      } else {
        setNumVisible(5) // 큰 화면
      }
    }
    handleResize()
    // 창의 크기가 변경될 때마다 호출
    window.addEventListener('resize', handleResize)

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // 컴포넌트가 마운트될 때 한 번만 호출
  useEffect(() => {
    setNumVisibleTags(numVisible)
  }, [numVisible])

  const handleClickPrev = () => {
    setStartIdx(Math.max(startIdx - numVisibleTags, 0))
  }

  const handleClickNext = () => {
    setStartIdx(Math.min(startIdx + numVisibleTags, tagInfo.length - startIdx))
  }
  function closeOverlay(i: number) {
    overlay[i].setMap(null)
  }
  const displayMarker = (place: any, i: number, data?: any) => {
    // 이미 생성된 마커가 있다면 해당 마커를 반환
    if (markers[i]) {
      markers[i].setMap(null) // 기존 마커를 지도에서 제거
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

    let newMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(place.y, place.x),
      image: markerImageProps,
    })

    var content = document.createElement('div')
    if (isShared) {
      if (isMain) {
        //공유지도 메인화면 인포윈도우
        content.innerHTML = `<div class="marker_overlay shadow">
    <div class="place_name text-primary">${place.name}</div>
    <div class="place_address">${place.address}</div>
</div>`
      } else {
        //공유지도 큰화면 인포윈도우
        content.innerHTML = `<div class="marker_overlay shadow">
    <div class="place_name text-primary">${place.name}</div>
    <div class="place_address">${place.address}</div>
    <hr>
    ${
      data &&
      data
        .map(
          (tag: any, i: number) =>
            tag.selected && `<div class="tag">${tag.content}</div>`,
        )
        .filter(Boolean)
        .join(``)
    }
    <div class="theme_name"></div>
</div>`
      }
    } else {
      //개인지도 인포윈도우
      content.innerHTML = `<div class="marker_overlay_isPrivate shadow">
      <div class="place_address">${place.address}</div>
    <div class="place_name text-primary">${place.name}</div>
    
    <hr>
    <div class="theme_name"></div>
</div>`
    }

    let yAnchor
    if (isMain) {
      yAnchor = 1.7

    } else if(isShared){
      yAnchor = 1.3
    } else {
      yAnchor=1.7
    }

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(place.y, place.x),
      content: content,
      zIndex: 2,
      yAnchor: yAnchor,
    })

    // 마커 클릭 이벤트 설정
    window.kakao.maps.event.addListener(newMarker, 'click', () => {
      handleMarkerClick(place.placeId)
      if (overlay.length !== 0) {
        console.log(1)
        overlay.forEach((o: any) => {
          o.setMap(null)
        })
      }
      console.log('Marker clicked:', place)
      setSelectedPlace(place)
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x))

      // 전체 독후감 데이터
      console.log(myMapData)

      // 최근 기록에서 나의 기록으로 변경

      // 필터링된 독후감 가져오기
      // place.id 값으로 필터링
      // TODO: 핀으로 검색하기(null) 인 경우 나중에 상태관리 필요함
      if (!isShared) {
        setIsTitleActive(`${place.name}에서 읽은 독후감`)
        const filteredReviews = myMapData.filter(
          (data) => data.pinRespDto.placeId === place.placeId,
        )
        // 독후감을 상태에 업데이트
        setFilteredReviews(filteredReviews)
      }

      // 필터된 독후감 데이터
      console.log(filteredReviews)
    })

    const handleMarkerClick = (id: string) => {
      const listItem = document.getElementById(`list-item-${id}`)
      console.log(id)
      if (listItem && listContainerRef.current) {
        const offsetTop =
          listItem.offsetTop - listContainerRef.current.offsetTop
        listContainerRef.current.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })
      }
      setSelectedMarkerIndex(id)
    }

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
  const mouseLeaveListItem = (i: number) => {
    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    if (mapRef.current) {
      closeOverlay(i)
    }
  }

  const openCustomOverlay = (place: any, i: number) => {
    if (overlay[i]) {
      overlay.forEach((o: any) => {
        o.setMap(null)
      })
      overlay[i].setMap(mapRef.current, markers[i])
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x))
    }
  }
  const getPosSuccess = (pos: GeolocationPosition) => {
    // 현재 위치(위도, 경도) 가져온다.
    var currentPos = new window.kakao.maps.LatLng(
      pos.coords.latitude, // 위도
      pos.coords.longitude, // 경도
    )
    // 지도를 이동 시킨다.

    mapRef.current.panTo(currentPos)
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
  useEffect(() => {
    if (isShared) {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          setLoading(false)
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

          const contentsParams = () => {
            const isParams = myMapData.find((d:any) => d.pinRespDto.placeId == query)
            console.log(isParams);
        
            mapRef.current.setLevel(2);
            mapRef.current.panTo(
              new window.kakao.maps.LatLng(isParams.pinRespDto.y, isParams.pinRespDto.x),
            )
          }

          let bounds = new window.kakao.maps.LatLngBounds()

          if (filteredReviews.length === 0) {
            myMapData.forEach((d: any, i: number) => {
              displayMarker(d.pinRespDto, i, d.tags)
            })
          } else {
            filteredReviews.forEach((d: any, i: number) => {
              displayMarker(d.pinRespDto, i, d.tags)
              bounds.extend(
                new window.kakao.maps.LatLng(d.pinRespDto.y, d.pinRespDto.x),
              )

              mapInstance.setBounds(bounds)
            })
            
          }
          if(query){
            contentsParams();
          }
        })
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
        setLoading(false)
        const mapInstance = new window.kakao.maps.Map(container, options)
        mapRef.current = mapInstance

        myMapData.forEach((d: any, i: number) => {
          displayMarker(d.pinRespDto, i)

          if (i == 0) {
            mapRef.current.setLevel(6)
            mapRef.current.panTo(
              new window.kakao.maps.LatLng(d.pinRespDto.y, d.pinRespDto.x),
            )
          }
        })
      }
    })
  }, [myMapData])

  const mapHeight = isFull === `100vh` ? windowHeight : 400

  return (
    <div style={{ position: 'relative' }}>
      {loading && <LoadingScreen height={isFull} />}
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
            <div>
              <div
                id="map"
                className={`${isFull !== `100vh` ? 'rounded-lg' : ''}`}
                style={{
                  width: '100%',
                  height: `${isFull}`,
                  position: 'relative',
                }}
              >
                {!isMain && (
                  <div>
                    <button
                      className="absolute bg-[#F66464] py-2 px-8 rounded-xl sm:bottom-[32%] sm:text-sm bottom-10 transform -translate-x-1/2 left-1/2 text-white hover:text-[#F66464] hover:bg-white font-bold z-20"
                      onClick={getCurrentPosBtn}
                    >
                      현재 위치
                    </button>

                    <div
                      ref={listContainerRef}
                      className="absolute scrollBar sm:w-[100vw] sm:top-[70%] w-[26vw] bg-[#f9f9f9] sm:h-[30%] h-full px-[2vw] py-[1vw] bg-opacity-80 sm:bg-opacity-0 overflow-y-auto rounded-lg"
                      style={{ zIndex: 2 }}
                    >
                      <div className="flex py-2 w-full sm:hidden justify-between text-center font-bold border-b-[1px] border-gray-600 mb-4">
                        {isFull == '100vh' && <GoBackButton />}

                        <div className=" mr-[8vw] ">
                          {isShared ? '공유 지도' : '개인 지도'}
                        </div>
                      </div>
                      <h1 className="font-bold">{isTitleActive}</h1>
                      {filteredReviews.length === 0 ? (
                        isShared ? (
                          <div className="ml-12">
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
                                  clickListItem(data.pinRespDto, i)
                                }}
                                onListMouseLeave={() => {
                                  mouseLeaveListItem(i)
                                }}
                                isShared={isShared}
                                selectedMarkerIndex={selectedMarkerIndex}
                              />
                            </div>
                          ))
                        )
                      ) : (
                        filteredReviews.map((data: any, i: number) => (
                          <div
                            key={i}
                            id={`list-item-${data.pinRespDto.placeId}`}
                          >
                            <ListItem
                              key={i}
                              index={i}
                              data={data}
                              selectedMarkerIndex={selectedMarkerIndex}
                              onListItemClick={() => {
                                clickListItem(data.pinRespDto, i)
                              }}
                              onListMouseLeave={() => mouseLeaveListItem(i)}
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
                    href={isShared ? '/map' : `/map/${user?.id}`}
                    className="absolute text-2xl font-bold top-2 right-2  z-40  bg-white p-4 rounded-full"
                  >
                    <div className="absolute top-0 right-2">+</div>
                  </Link>
                )}

                {isShared && (
                  <div className="absolute top-6 left-1/3 transform -translate-x-1/5 sm:w-full sm:left-1/2 sm:-translate-x-1/2  z-40 flex flex-row rounded-lg">
                    {!isMain && (
                      <div
                        className="p-2 cursor-pointer sm:absolute sm:left-4"
                        onClick={handleClickPrev}
                      >
                        &lt;
                      </div>
                    )}
                    <div className=" flex mx-auto justify-between">
                      {!isMain &&
                        tagInfo
                          .slice(startIdx, startIdx + numVisibleTags)
                          .map((tag: any, i: number) => (
                            <div
                              key={i}
                              className={`box-border flex flex-row justify-center text-sm sm:justify-between items-center px-4 py-2 mx-2 border border-gray-300 rounded-full  ${isSelectedTags[startIdx + i] ? 'bg-[#E57C65] text-white' : 'bg-white hover:border-[#C05555] hover:text-[#C05555]'}`}
                              onClick={() => searchTag(startIdx + i)}
                            >
                              {tag.content}
                            </div>
                          ))}
                    </div>
                    {!isMain && (
                      <div
                        className="p-2 cursor-pointer sm:absolute sm:right-4"
                        onClick={handleClickNext}
                      >
                        &gt;
                      </div>
                    )}
                  </div>
                )}
              </div>
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
