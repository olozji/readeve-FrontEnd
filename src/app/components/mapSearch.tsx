'use client'

import React, { useEffect, useState, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}
interface MapSearchProps {
  searchPlace: string
}

const MapSearch = ({ searchPlace }: MapSearchProps): React.ReactElement => {

  const mapRef = useRef<any>(null)

  const [Place, setPlaces] = useState([]) // 추가할 장소데이터 설정

  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<any | null>(null);
  //const [hoveredMarker, setHoveredMarker] = useState<any | null>(null);


  // TODO:마커 호버시 리스트 배경색 효과를 위해 만든 state -> 아직 진행중
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);



  
  useEffect(() => {
    const kakaoMapScript = document.createElement('script')
    kakaoMapScript.async = false
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=6d8ac2fb0740657f1e67a9163c8b331b&autoload=false&libraries=services`
    document.head.appendChild(kakaoMapScript)

    

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords
          const currentPosition = new window.kakao.maps.LatLng(
            latitude,
            longitude,
          )

          const container = document.getElementById('map')
          let options = {
            center: currentPosition,
            level: 3,
          }
          const map = new window.kakao.maps.Map(container, options)

        mapRef.current = map;

        //장소 검색 라이브러리
        const ps = new window.kakao.maps.services.Places()

        let infowindow = new window.kakao.maps.InfoWindow({
            zIndex: 1, 
            // removable : true,
          })
          let searchOptions = {
            location: currentPosition,
            // radius: 10000,
            sort: window.kakao.maps.services.SortBy.DISTANCE,
            // useMapBound:true
          }
          ps.keywordSearch(searchPlace, placesSearchCB, searchOptions)

        function placesSearchCB(data: any, status: any, pagination: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            let bounds = new window.kakao.maps.LatLngBounds()

            for (let i = 0; i < data.length; i++) {
              displayMarker(data[i]) //장소 데이터드를 마커로 표시
              bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x))
            }

            map.setBounds(bounds)
            // 페이지 목록 보여주는 displayPagination() 추가
            displayPagination(pagination)
            setPlaces(data)
          }
        }

        
        //장소데이터를 마커로 지도위에 표시하는 함수
        function displayMarker(place: any) {
          let marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          })


          //호버 했을 때 infoWindow 뜨게 만들어 놨어요!! 근데 마우스 내렸을때 안 없어져서 내릴때 없애는 코드 추가해야 대요
          window.kakao.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(
              '<div style="padding:5px;font-size:12px;">' +
                place.place_name +
                '</div>',
            )
            setSelectedMarkerIndex(marker);
            infowindow.open(map, marker)
           
          })

          window.kakao.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
          })
        }


        function displayPagination(pagination: any) {
          let paginationEl = document.getElementById('pagination')

          if (!paginationEl) return // Exit early if element is not found

          let fragment = document.createDocumentFragment(),
            i

          // 기존에 추가된 페이지 번호 삭제
          while (paginationEl.hasChildNodes()) {
            if (paginationEl.lastChild) {
              paginationEl.removeChild(paginationEl.lastChild)
            }
          }

          for (i = 1; i <= pagination.last; i++) {
            let el = document.createElement('a')
            el.href = '#'
            el.innerHTML = i.toString()

            if (i === pagination.current) {
              el.className = 'on'
            } else {
              el.onclick = (function (i) {
                return function () {
                  pagination.gotoPage(i)
                }
              })(i)
            }

              fragment.appendChild(el)
            }
            paginationEl?.appendChild(fragment)
          }
        })
      })
    }

    kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
  }, [searchPlace])



  // 리스트 아이템 이벤트

  const handleListItem = (place: any, index:any) => {
    if (selectedPlace && selectedPlace.id === place.id) {
      // 같은 장소라면 정보 창을 닫고 selectedPlace 상태를 재설정
      selectedPlace.infowindow.close();
      setSelectedPlace(null);
      setSelectedMarkerIndex(index);
    } else {
      if (selectedPlace) {
        selectedPlace.infowindow.close();
      }

      // selectedPlace 상태를 업데이트
      const infowindow = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>',
        zIndex: 1,
        // removable : true,
      });

      // 호버 이벤트 처리
      const handleMarkerHover = (place:any) => {
        if (!hoveredPlace) {  // 한 번만 처리하도록 추가
          setSelectedPlace({ id: place.id, infowindow, marker });
          setSelectedMarkerIndex(index);
          infowindow.open(mapRef.current, marker);
        }
      };

     // TODO:스타일 이벤트 왜 안되는지?? 진행 중..
     /*const handleMarkerClick = () => {
      if (!hoveredPlace) {  // 한 번만 처리하도록 추가
        setSelectedPlace({ id: place.id, infowindow, marker });
        setSelectedMarkerIndex(index);
        infowindow.open(mapRef.current, marker);
      }
    };*/


      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position: new window.kakao.maps.LatLng(place.y, place.x), 
      });


      window.kakao.maps.event.addListener(marker, 'mouseover', handleMarkerHover);

     
      window.kakao.maps.event.addListener(marker, 'mouseout', function () {
        setHoveredPlace(null);
        infowindow.close();
      });

      infowindow.open(mapRef.current, marker);

      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));

      setSelectedPlace({ id: place.id, infowindow, marker });
      setSelectedMarkerIndex(index);
    }
  };
  
  // TODO:첫 클릭시 해당 위치 못잡는 버그 추후에 수정해야됨
  const clickListItem = (place: any) => {
    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));
    mapRef.current.setLevel(2);
  };
  


  return (
    <div>
      {/* 페이지 컨텐츠 및 지도를 표시할 컨테이너 */}
      <div id="map" 
           className='relative'    
      style={{ width: '100%', height: '800px' }}>
      {/* 다른 페이지 컨텐츠 */}
      </div>
      <div
        id="result-list"
        className='absolute top-80 right-10 w-50 inline-block overflow-scroll overflow-y-auto max-h-[40rem] z-10 box-border rounded-md border-slate-300 hover:border-indigo-30'
      >
        {Place.map((item: any, i) => (
          <div 
            key={i} 
            className={`bg-white border-4 rounded-md border-slate-300 hover:bg-slate-300 ${selectedMarkerIndex === i ? 'bg-slate-200' : ''}`}
            style={{ marginTop: '5px', marginBottom: '20px', cursor:'pointer' }}
            onClick={() => clickListItem(item)}
            onMouseEnter={() => handleListItem(item, i)}
          >
            <span style={{ fontSize: 'x-small' }}>[ {i + 1} ]</span>
            <div>
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                {item.place_name}
              </div>
              {item.road_address_name ? (
                <div
                  style={{ padding: '0px 10px 0px 10px', fontSize: 'small' }}
                >
                  <div style={{ fontSize: 'small' }}>
                    📍 {item.road_address_name}
                  </div>
                  <span style={{ fontSize: 'small' }}>
                    📍 {item.address_name}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: 'small' }}>
                  📍 {item.address_name}
                </span>
              )}
              <span style={{ fontSize: 'small' }}>📞 {item.phone}</span>
              <br></br>
            </div>
          </div>
        ))}
        <div id="pagination"></div>
      </div>
    </div>
  )
}

export default MapSearch
