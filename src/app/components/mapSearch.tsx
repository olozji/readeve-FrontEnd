'use client'

import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}
interface MapSearchProps {
  searchPlace: string
}

const MapSearch = ({ searchPlace }: MapSearchProps): React.ReactElement => {
  const [Place, setPlaces] = useState([]) // 추가할 장소데이터 설정
  useEffect(() => {
    const kakaoMapScript = document.createElement('script')
    kakaoMapScript.async = false
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=6d8ac2fb0740657f1e67a9163c8b331b&autoload=false&libraries=services`
    document.head.appendChild(kakaoMapScript)

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        var container = document.getElementById('map')
        var options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        }
        const map = new window.kakao.maps.Map(container, options)

        //장소 검색 라이브러리
        const ps = new window.kakao.maps.services.Places()

        let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 })

        ps.keywordSearch(searchPlace, placesSearchCB)

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
            infowindow.open(map, marker)
          })
        }
        function displayPagination(pagination: any) {
          var paginationEl = document.getElementById('pagination')

          if (!paginationEl) return // Exit early if element is not found

          var fragment = document.createDocumentFragment(),
            i

          // 기존에 추가된 페이지 번호 삭제
          while (paginationEl.hasChildNodes()) {
            if (paginationEl.lastChild) {
              paginationEl.removeChild(paginationEl.lastChild)
            }
          }

          for (i = 1; i <= pagination.last; i++) {
            var el = document.createElement('a')
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
    }

    kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
  }, [searchPlace])

  return (
    <div>
      {/* 페이지 컨텐츠 및 지도를 표시할 컨테이너 */}
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      {/* 다른 페이지 컨텐츠 */}
      <div
        id="result-list"
        style={{
          display: 'inline-block',
          width: '40%',
        }}
      >
        {Place.map((item: any, i) => (
          <div key={i} style={{ marginTop: '5px', marginBottom: '20px' }}>
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
