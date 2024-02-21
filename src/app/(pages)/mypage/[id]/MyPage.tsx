'use client'

import { BookLayout } from '@/app/components/bookLayout'
import { markersState } from '@/store/mapAtoms'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { PropType } from '../../detail/[id]/page'
import MapView from '../../map/[id]/MapView'
import Link from 'next/link';

declare global {
  interface Window {
    kakao: any
  }
}
interface ParamType {
  id: string
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
    <section className="">
      <h1 className="text-center font-bold text-lg">내 서재</h1>
      <section>
        {session?.data && (
          <div className="flex border border-b-8">
            <>
              <div>
                <Image
                  src={session.data.user?.image!}
                  width={100}
                  height={100}
                  alt="Picture of the author"
                />
              </div>
              <div className="">
                <h2>이름 {session.data.user?.name}</h2>
              </div>
            </>
          </div>
        )}
      </section>
      <div>
        <div>
          {documents.length !== 0 ? (
            <div>
              <Link href={`/map/${props.id}`}>내 지도 크게보기</Link>
              <MapView myMapData={documents}></MapView>
            </div>
          ) : (
            <div>
              <div id="map" style={{ display: 'none' }}></div>
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

export default MyPageComponent
