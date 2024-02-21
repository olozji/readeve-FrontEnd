'use client';

import { BookLayout } from '@/app/components/bookLayout';
import { markersState } from '@/store/mapAtoms'
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { PropType } from '../../detail/[id]/page';

declare global {
  interface Window {
    kakao: any
  }
}
interface ParamType{
  id:string
}


const MyPageComponent= (props: ParamType) => {
  let session = useSession()
  console.log(props.id)
  const [map,setMap] = useState<any>()

  const [marker, setMarker] = useState<any>()
  const [address, setAddress] = useState('')
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectBook, setSelectBook] = useState<any[]>([]);

   

  
  
  function displayMarker(place: any,map:any) {
    // 마커를 생성하고 지도에 표시합니다
    let marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x) 
    });
    let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

    // 마커에 클릭이벤트를 등록합니다
    window.kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}
  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setDocuments(parsedData);
    }
},[])
  useEffect(() => {
    
    window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 2,
        };

        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance)
        let bounds = new window.kakao.maps.LatLngBounds();  
        // documents에 있는 데이터로 마커를 생성하여 지도에 추가
      documents.forEach((d: any) => {
          console.log(1)
          displayMarker(d.place,mapInstance);
          bounds.extend(new window.kakao.maps.LatLng(d.place.y, d.place.x))
    
      })
      mapInstance.setBounds(bounds);
    });
}, [documents]);


  
 


  return (
    <section className=''>
    <h1 className='text-center font-bold text-lg'>내 서재</h1>
  <section>
  {session?.data && 
    <div className='flex border border-b-8'>
    <>
  <div>
    <Image
      src={session.data.user?.image!}
      width={100}
      height={100}
      alt="Picture of the author"
    />
  </div>
  <div className=''>
    <h2>이름 {session.data.user?.name}</h2>
  </div>
    </>
    </div>
  }
  </section>
    <div>
    <div>
  {documents.length !== 0 ? (
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
          ) : (
              <div>
              <div id='map' style={{display:'none'}}></div>
    <div>독서 기록을 남기고 지도를 확인하세요</div>
    </div>
  )}
</div>
      <div>{address}</div>
      {selectBook}
      <BookLayout></BookLayout>
    </div>
    </section>
  )
}

export default MyPageComponent;