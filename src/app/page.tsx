'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import AddPlace from './components/map'
import Link from 'next/link'
import SlideCarousel from './components/carousel'
import { useEffect, useState } from 'react'

export default function Home() {

  const [map, setMap] = useState(false);

  let session = useSession()
  if (session) {
    console.log(session)
  }

  useEffect(()=> {
    setMap(true);
  },[])

  return (
    <div>
      <div>읽는곳곳</div>
      <h1>누구나 볼 수 있는 페이지</h1>
      {session.data ? (
        <div>
          {session.data.user?.name}
          <Image
            src={session.data.user?.image}
            width={100}
            height={100}
            alt="Picture of the author"
          />
            <div>
          </div>
        </div>
      ) : (
        <>
        <div>로그인된 정보 X</div>
        </>
      )}
      <AddPlace onClose={() => setMap(false)} selectedPlace={''} onMarkerClickParent={function (markerInfo: string): void {
        throw new Error('Function not implemented.')
      } }/>
      <SlideCarousel/>
    </div>
  )
}
