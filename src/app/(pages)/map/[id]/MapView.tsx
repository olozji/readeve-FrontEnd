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
  const [map, setMap] = useState<any>();
  const [myPins, setMyPins] = useState([])
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  const [filteredReviews, setFilteredReviews] = useState<any>([]);

  const displayMarker = (place: any) => {
    // 이미 생성된 마커가 있다면 해당 마커를 반환
    if (marker) {
      marker.setMap(null); // 기존 마커를 지도에서 제거
    }
  
    // 새로운 마커 생성
    let newMarker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    });
  
    // 마커 클릭 이벤트 설정
    window.kakao.maps.event.addListener(newMarker, 'click', () => {
      console.log('Marker clicked:', place);
      setSelectedPlace(place);
      clickListItem(place); // 마커 클릭 시 리스트 아이템 처리
    });
  
    // 생성된 마커를 state에 저장
    setMarker(newMarker);
  };


  const openReviewForMarker = (markerId: string) => {
    // markerId를 이용하여 독후감을 찾고 열기
    const reviewData = myMapData.find((data) => data.id === markerId);
    if (reviewData) {
      // reviewData를 사용하여 독후감 열기 로직을 추가
      console.log('Open review for marker:', reviewData);
      // 이 부분에 독후감을 열기 위한 로직을 추가하면 됩니다.
    }
  };


  const clickListItem = (place: any) => {
    console.log(clickListItem)
    // useRef로 저장한 map을 참조하여 지도 이동 및 확대
    if (mapRef.current) {
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.y, place.x));
      mapRef.current.setLevel(2);
      openInfoWindow(place);
    }
  };


  const openInfoWindow = (place: any) => {
    let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    infowindow.setContent(
      '<div style="padding:5px;font-size:12px;">' +
        place.place_name +
        '</div>'
    );
    infowindow.open(mapRef.current, new window.kakao.maps.LatLng(place.y, place.x));
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
      mapRef.current = mapInstance;

     
      
      let bounds = new window.kakao.maps.LatLngBounds();

      const markerList: Record<string, any> = {};
      
      // myMapData에 있는 데이터로 마커를 생성하여 지도에 추가
      myMapData.forEach((d: any) => {
        console.log(1)
        displayMarker(d.place);
        bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
        mapRef.current.panTo(new window.kakao.maps.LatLng(d.place.y, d.place.x));
     
      mapInstance.setBounds(bounds)
      mapRef.current.panTo(new window.kakao.maps.LatLng(d.place.y, d.place.x));

    
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
          {myMapData.map((data: any, i: number) => (
            <div key={i}>
              {/* TODO::리스트 아이템에 온클릭 이벤트를 달아서 지도랑 리스트랑 상호작용하게 해야하는데 
              id='map' 인 div가 여기 있어서 컴포넌트로 분리가 안되네요 ㅜㅜ
              그래서 ListItem만 빼놨고,ListItem을 감싸고 있는 div에 온클릭이나 마우스 이벤트를 달아야 될거 같아요
              그리고 가능하시면 지도 위에 피그마처럼 띄워서 올리는거도 부탁드려요!
              PS. 정 안되면 저희 mapSearch에 있는 리스트 코드 잘 가져와서 쓰는게 나을거 같기도 합니다 */}
              <ListItem 
              key={i} 
              data={data}  
              onListItemClick={() => {
                 console.log('리스트 아이템 클릭됨', data.place); 
                 clickListItem(data.place); 
                }} 
              />
              </div>
          ))}
        </div>
        <div>
            {filteredReviews.map((data: any, i: number) => (
              <div key={i}>
              <ListItem 
                data={data}  
                onListItemClick={() => {
                  console.log('리스트 아이템 클릭됨', data.place); 
                  clickListItem(data.place); 
                }} 
              />
              </div>
            ))}
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
