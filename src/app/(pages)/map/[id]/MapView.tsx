'use client'

import ListItem from '@/app/components/listItem'
import { mapState } from '@/store/mapAtoms';
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil';

interface MapDataType {
  myMapData: any[]
}

const MapView = ({ myMapData }: MapDataType) => {

  const mapRef = useRef<any>(null)
  const [recoilMap, setRecoilMap] = useRecoilState<any>(mapState)
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindows, setInfoWindows] = useState<any[]>([]);

  const [filteredReviews, setFilteredReviews] = useState<any>([]);

  const displayMarker = (place: any,i:number) => {
    // 이미 생성된 마커가 있다면 해당 마커를 반환
    if (markers[i]) {
      markers[i].setMap(null); // 기존 마커를 지도에서 제거
    }
  
    // 새로운 마커 생성
    let newMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      zIndex: 1,
    });

    
  
    // 마커 클릭 이벤트 설정
    window.kakao.maps.event.addListener(newMarker, 'click', () => {
      console.log('Marker clicked:', place);
      setSelectedPlace(place);
      mapRef.current.setLevel(2);
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));
      
      // 전체 독후감 데이터
      console.log(myMapData);
      
     
     // 필터링된 독후감 가져오기
     // place.id 값으로 필터링
     // TODO: 핀으로 검색하기(null) 인 경우 나중에 상태관리 필요함
      const filteredReviews = myMapData.filter((data) => data.place.id === place.id);
    
      // 독후감을 상태에 업데이트
      setFilteredReviews(filteredReviews);
      
      // 필터된 독후감 데이터
      console.log(filteredReviews);


      // Infowindow 열기
      infowindow.setContent(
        `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`
      );
      infowindow.open(mapRef.current, newMarker);
    });
  
    setMarkers((prevMarkers) => [...prevMarkers, newMarker])
    setInfoWindows((prevInfoWindows) => [...prevInfoWindows, infowindow])

  };


  const clickListItem = (place: any,i:number) => {
    console.log(clickListItem)
    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    if (mapRef.current) {
      mapRef.current.setLevel(2);
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));
      openInfoWindow(place,i);
    }
  };


  const openInfoWindow = (place: any,i:number) => {
    let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    infowindow.setContent(
      '<div style="padding:5px;font-size:12px;">' +
        place.place_name +
        '</div>'
    );
    infoWindows[i].open(mapRef.current, markers[i]);
  };



  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 2,
      }

      const mapInstance = new window.kakao.maps.Map(container, options)
      mapRef.current = mapInstance;

     
      
      let bounds = new window.kakao.maps.LatLngBounds();

      const markerList: Record<string, any> = {};
      
      // myMapData에 있는 데이터로 마커를 생성하여 지도에 추가
      myMapData.forEach((d: any,i:number) => {
        console.log(1)
        displayMarker(d.place,i);
        bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
        mapRef.current.panTo(new window.kakao.maps.LatLng(d.place.y, d.place.x));
     
      mapInstance.setBounds(bounds)

    
      //setMap(mapInstance)
      //setRecoilMap(mapInstance)
      })
    })
  }, [myMapData])
  

  return (
    <div>
      {myMapData.length !== 0 ? (
        <div>
          <div id="map" style={{ width: '100%', height: '400px' }}>
            {filteredReviews.length === 0
              ? myMapData.map((data: any, i: number) => (
                  <div key={i}>
                    <ListItem
                      key={i}
                      index={i}
                      data={data}
                      onListItemClick={() => {
                        //  console.log('리스트 아이템 클릭됨', data.place);
                        clickListItem(data.place, i)
                      }}
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
                        //  console.log('리스트 아이템 클릭됨', data.place);
                        clickListItem(data.place, i)
                      }}
                    />
                  </div>
                ))}
          </div>
          <div></div>
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
