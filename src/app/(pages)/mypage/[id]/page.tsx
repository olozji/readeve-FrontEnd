'use client';

import { BookLayout } from '@/app/components/bookLayout';
import { markersState } from '@/store/mapAtoms'
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

declare global {
  interface Window {
    kakao: any
  }
}

const myPage = () => {

  let session = useSession()
  if (session) {
    console.log(session)
  }


  const [map, setMap] = useState<any>()
  const [marker, setMarker] = useState<any>()
  const [address, setAddress] = useState('')
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectBook, setSelectBook] = useState<any[]>([]);


  // 저장된 지도의 마크 데이터를 꺼내와 쓰기
  

    
  //초기값이 false 여서 처음 마운트될때는 실행 안 되는 useEffect인 커스텀 훅 이에요  
  const useDidMountEffect = (func: any, deps: any) => {
    const didMount = useRef(false)

    useEffect(() => {
      if (didMount.current) func()
      else didMount.current = true
    }, deps)
  }

   
  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setDocuments(parsedData);
    }
  }, [])

  
  useDidMountEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      }

      setMap(new window.kakao.maps.Map(container, options))
      
      documents.forEach((d:any) => {
        let marker = new window.kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: new window.kakao.maps.LatLng(d.place.y, d.place.x),
         
        });
        
      })
    })
},[documents])

  
 
 //---------------------현재 위치 가져오기---------------------------//

  const getPosSuccess = (pos: GeolocationPosition) => {
    // 현재 위치(위도, 경도) 가져온다.
    let currentPos = new window.kakao.maps.LatLng(
      pos.coords.latitude, // 위도
      pos.coords.longitude, // 경도
    )
    console.log(currentPos)

    // 지도를 이동 시킨다.
    var geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.coord2Address(
      currentPos.La, //현재위도
      currentPos.Ma, //현재경도
      (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          let addr = !!result[0].road_address
            ? result[0].road_address.address_name
            : result[0].address.address_name

          // 클릭한 위치 주소를 가져온다.
          setAddress(addr)
          

          // 기존 마커를 제거하고 새로운 마커를 넣는다.
          marker.setMap(null)
          map.panTo(currentPos)
          // 마커를 클릭한 위치에 표시합니다
          marker.setPosition(currentPos)
          marker.setMap(map)
        }
      },
    )
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

  return (
    <section className=''>
    <h1 className='text-center font-bold text-lg'>내 서재</h1>
  <section>
  {session?.data && 
    <div className='flex border border-b-8'>
    <>
  <div>
    <Image
      src={session.data.user?.image}
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
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <div onClick={getCurrentPosBtn}>현재 위치</div>
      <div>{address}</div>
      {selectBook}
      <BookLayout></BookLayout>
    </div>
    </section>
  )
}

export default myPage;