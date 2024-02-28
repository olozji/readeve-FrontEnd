'use client'

import { BookLayout } from '@/app/components/bookLayout'
import { markersState } from '@/store/mapAtoms'
import { useSession } from 'next-auth/react'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { PropType } from '../../detail/[id]/page'
import MapView from '../../map/[id]/MapView'
import Link from 'next/link';

import lampIcon from '/public/images/lampicon.png';
import tableImage from '/public/images/tableImg.png';
import { table } from 'console'

declare global {
  interface Window {
    kakao: any
  }
}
interface ParamType {
  id: string
  markerImage:StaticImageData;
  markerImageOpacity:StaticImageData;
}

const MyPageComponent = (props: ParamType) => {
  let session = useSession()
  console.log(props.id)
  const [map, setMap] = useState<any>()

  const [marker, setMarker] = useState<any>()
  const [address, setAddress] = useState('')
  const [documents, setDocuments] = useState<any[]>([])
  const [selectBook, setSelectBook] = useState<any[]>([])

  
  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo')

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setDocuments(parsedData)
    }
  }, [])
 

  return (
    <section className="bg-[#F1E5CF] mx-auto">
      <div className='mx-auto justify-center text-center'>
        <Image
          src={lampIcon.src}
          className='inline-block text-center'
          alt={lampIcon.src}
          width={200}
          height={100}
        />
        <div>
        <h1 className='myCustomText'>내 서재</h1>
        </div>
      </div>
      <section>
        <div className='relative mx-auto justify-center text-center'>
            <Image
              src={tableImage.src}
              className='inline-block text-center'
              alt={tableImage.src}
              width={1500}
              height={1500}
            />
            <div className='absolute top-20 left-1/2 transform -translate-x-1/2 z-10'>
            <BookLayout isMain={true}></BookLayout>
            </div>
            <div>
            {documents.length !== 0 ? (
            <div className='absolute left-0 bottom-20 right-0 px-[20rem]'>
              <Link href={`/map/${props.id}`}>내 지도 크게보기</Link>
              <MapView 
                isMain={true}
                myMapData={documents} 
                isShared={false} 
                isFull={'600px'} 
                markerImage={props.markerImage} 
                markerImageOpacity={props.markerImageOpacity}
                />
            </div>
          ) : (
            <div>
              <div id="map" style={{ display: 'none' }}></div>
              <div>독서 기록을 남기고 지도를 확인하세요</div>
            </div>
          )}
            </div>
        </div>
        <div>{address}</div>
        {selectBook}
       
      </section>
    </section>
  )
}

export default MyPageComponent
