'use client'

import { placeState } from '@/store/writeAtoms';
import { StaticImageData } from 'next/image';
import React, { useEffect, useState, useRef } from 'react'
import { useRecoilState } from 'recoil';


declare global {
  interface Window {
    kakao: any
  }
}
interface MapSearchProps {
  searchPlace: string
  onMarkerClick: (place: string) => void;
  markerImage: StaticImageData;
  mapHeight?:string

}

const MapSearch = ({ searchPlace, onMarkerClick, markerImage ,mapHeight  }: MapSearchProps): React.ReactElement => {

  const mapRef = useRef<any>(null)
  const listContainerRef = useRef<any>(null);

  const [Place, setPlaces] = useState([]) // 추가할 장소데이터 설정

  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<any | null>(null);
  const [placeInfo,setPlaceInfo] = useRecoilState<any>(placeState)

  // TODO:마커 호버시 리스트 배경색 효과를 위해 만든 state -> 아직 진행중
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);



  
  useEffect(() => {
    const kakaoMapScript = document.createElement('script')
    kakaoMapScript.async = false
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=ed0400bf5dc9c6b6a4e99d63d27799a4&autoload=false&libraries=services`
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

         // 이미지 마커 생성
        //  const markerImageProps = new window.kakao.maps.MarkerImage(
        //   markerImage.src,
        //   new window.kakao.maps.Size(30,30),
        // )

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
              displayMarker(data[i], i) //장소 데이터드를 마커로 표시
              bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x))
            }

            map.setBounds(bounds)
            // 페이지 목록 보여주는 displayPagination() 추가
            displayPagination(pagination)
            setPlaces(data)
          }
        }

        
        //장소데이터를 마커로 지도위에 표시하는 함수
        function displayMarker(place: any, index:any) {

          let markerImageProps;

         
            markerImageProps = new window.kakao.maps.MarkerImage(
              markerImage.src,
              new window.kakao.maps.Size(30,30),
            );
      
          let marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
            image:markerImageProps,
          })

          // 마커를 클릭했을 때, input에 장소이름 반영되게 props로 받아온 콜백함수 호출
          window.kakao.maps.event.addListener(marker, 'click', () => {
            setPlaceInfo(place)
          });

          //호버 했을 때 infoWindow 뜨게 만들어 놨어요!! 근데 마우스 내렸을때 안 없어져서 내릴때 없애는 코드 추가해야 대요
          window.kakao.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(
              '<div style="padding:5px;font-size:12px;">' +
                place.place_name +
                '</div>',
            )
            setHoveredPlace(place);
            setSelectedMarkerIndex(index);
            infowindow.open(map, marker)
           
            // 리스트 아이템에 hover 이벤트 처리
            // 각 아이템에 place.id를 부여해 마커 place.id가 아이템 인덱스가 일치할때
            const listItem = document.getElementById(`list-item-${place.id}`);
            if (listItem) {
              listItem.addEventListener('mouseover', () => {
                handleMarkerHover(place.id)
              });
              listItem.addEventListener('mouseout', () => {
                //handleMarkerMouseOut();
                //infowindow.close();
            });
            console.log(`Marker ID: ${place.id}, ListItem ID: ${listItem.id}`)}
            

              // 리스트 아이템 hover 이벤트 처리
              const handleMarkerHover = (index: number) => {
                setSelectedMarkerIndex(index);
              };

              // 리스트 아이템 마우스 아웃 이벤트 처리
              // const handleMarkerMouseOut = () => {
              //   setHoveredPlace(null);
              // };

              // 마커를 누르면 해당 아이템으로 스크롤 위치 조절
              const handleMarkerClick = (id: string) => {
                const listItem = document.getElementById(`list-item-${id}`);
                if (listItem && listContainerRef.current) {
                  // listItem의 위치를 계산하여 해당 위치로 스크롤 조절
                  const offsetTop = listItem.offsetTop - listContainerRef.current.offsetTop;
                  listContainerRef.current.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
              
              };

              window.kakao.maps.event.addListener(marker, 'click', () => {
                handleMarkerClick(place.id);
              });

            })

            
          window.kakao.maps.event.addListener(marker, 'mouseout', function () {
            setHoveredPlace(null);
            setSelectedMarkerIndex(null); 
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



  const handleListItem = (place: any, index: number) => {
   
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      zIndex: 1,
    });

    let markerImageProps;

   
      // 선택된 장소 일 경우엔 markerImage 사용
      markerImageProps = new window.kakao.maps.MarkerImage(
        markerImage.src,
        new window.kakao.maps.Size(30,30),
      );
  
    


    const marker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(place.y, place.x),
      image:markerImageProps,
    });

     // 마커를 클릭했을 때, input에 장소이름 반영되게 props로 받아온 콜백함수 호출
     window.kakao.maps.event.addListener(marker, 'click', () => {
       setPlaceInfo(place)
    });

    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      setHoveredPlace(place);
      setSelectedMarkerIndex(index);
      infowindow.open(mapRef.current, marker);
    });

    

    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      setHoveredPlace(null);
      setSelectedMarkerIndex(null);
      infowindow.close();
    });

    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      setHoveredPlace(null);
      setSelectedMarkerIndex(null);
      infowindow.close();
    });

    const listItem = document.getElementById(`list-item-${place.id}`);
    if (listItem) {
      listItem.addEventListener('mouseleave', () => {
        infowindow.close();
      });
    }

     const handleMarkerHover = (index:any) => {
      if (selectedMarkerIndex == index) {
        setSelectedMarkerIndex(index);
      }
    };

    mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));

    setSelectedPlace({ id: place.id, infowindow, marker });
    setSelectedMarkerIndex(index);
    handleMarkerHover(index);
    infowindow.open(mapRef.current, marker);
    mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));


  };

  


  // TODO:첫 클릭시 해당 위치 못잡는 버그 추후에 수정해야됨
  const clickListItem = (place: any) => {
    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));
    mapRef.current.setLevel(2);
    setPlaceInfo(place)
  };



  return (
    <div className='pb-10 border-b-2'>
      {/* 페이지 컨텐츠 및 지도를 표시할 컨테이너 */}
      <div className='flex'>
      <div id="map" 
           className='relative'    
      style={{ width: '60%', height: mapHeight}}>

      {/* 다른 페이지 컨텐츠 */}
      </div>
      <div
        ref={listContainerRef}
        className='scrollBar w-[40%] bg-white h-full max-h-[40vh] bg-opacity-80 overflow-y-auto rounded-lg'
      >
        {Place.length === 0? (
          <div className="p-4 text-center text-[#B6B6B6] mt-40">
              검색된 장소가 없습니다. 장소를 검색해보세요!
          </div>
        ) : (
          <>
        {Place.map((item: any, i) => (
          <div 
            key={item.id}
            id={`list-item-${item.id}`} 
            className={`px-2 rounded-md  bg-white ${selectedMarkerIndex === i ? 'bg-[#E57C65]' : ''}`}
            style={{ marginTop: '5px', marginBottom: '20px', cursor:'pointer' }}
            onClick={() => clickListItem(item)}
            onMouseEnter={() => handleListItem(item, i)}
            onMouseLeave={() => handleListItem(item, i)}
          >
            <div className='border-b'>
              <div className='text-[#E57C65] font-bold text-md' style={{ marginTop: '10px', marginBottom: '10px' }}>
                {item.place_name}
              </div>
              {item.road_address_name ? (
                <div
                  className='text-[#B6B6B6] text-xs'
                >
                  <div 
                   className='text-[#B6B6B6] text-xs'
                   >
                    {item.road_address_name} |  {item.address_name}
                  </div>
                </div>
              ) : (
                <span 
                  className='text-[#B6B6B6] text-xs'
                  >
                  {item.address_name}
                </span>
              )}
              <br></br>
            </div>
          </div>
        ))}
        <div id="pagination"></div>
        </>
        )}
      </div>
    </div>
    </div>
  )
}

export default MapSearch
