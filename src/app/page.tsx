'use client'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import AddPlace from './components/map'
import Link from 'next/link'
import SlideCarousel from './components/carousel'
import { useEffect, useState } from 'react'
import ReviewPage from './(pages)/reviews/page'
import { useRecoilState, useRecoilValue } from 'recoil'
import { allReviewSelector, selectedReviewState } from '@/store/writeAtoms'
import axios from 'axios'
import { sessionState } from '@/store/AuthAtoms'
import LogoutButton from './components/buttons/LogoutButton'
import mainLogo from '/public/images/mainLogo.png'
import MapView from './(pages)/map/[id]/MapView'
import markerImage from '/public/images/marker1.png'
import markerImageOpacity from '/public/images/marker2.png'
import { BookLayout } from './components/bookLayout'

export default function Home() {
  let session = useSession()
  console.log(session)

  const [map, setMap] = useState(false)
  const [selectedReview, setSelectedReview] =
    useRecoilState(selectedReviewState)
  const allReviews = useRecoilValue(allReviewSelector)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [documents, setDocuments] = useState<any[]>([])
  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo')

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      const filteredData = parsedData.filter(
        (data: any) => !data.place.isPrivate,
      )
      setDocuments(filteredData)
    }
  }, [])

  const handleChange = (index: any) => {
    setCurrentIndex(index)
  }

  const mainReviewToShow = 6 // 메인화면에서 보여질 갯수

  const mainReviews = Array.isArray(allReviews)
    ? allReviews.slice(0, mainReviewToShow)
    : []
  const fetchData = async () => {
    console.log(1)
    try {
      const response = await axios.get('http://localhost:8081/api/pin')
      console.log(response.data) // 서버에서 받은 데이터 출력
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchData()
    setMap(true)
  }, [])

<<<<<<< HEAD
  

  
=======
>>>>>>> 538c0a3d42d5bab709276b0be9d6ab8e9dc8a096
  return (
    <div>
      <div
        className="relative w-full py-24 px-10 grid grid-cols-1 sm:px-[25%] sm:grid-cols-2 "
        style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient( #ffffff 20%, #f7e9d4)',
        }}
      >
        <div className="relative z-10 text-start py-4">
          <div className="text-black text-left text-3xl font-display font-bold mb-2">
            나만의 독후감 지도를
            <br /> 만들어보세요!
          </div>
          <div className="text-black text-left text-sm font-display mb-10">
            읽는 곳곳을 통해 지도 위에 독후감을 작성하고
            <br />
            독서장소를 공유하며 새로이 독서를 기억할 수 있습니다.
          </div>
          <div>
          {session?(<Link href='/write' className=" bg-[#FFB988] text-white font-bold py-4 px-6 hover:bg-[#AF6C3E] rounded-lg shadow-md hover:shadow-lg">
            독후감 기록하기
          </Link>):(<div className=" bg-[#FFB988] text-white font-bold py-4 px-6 hover:bg-[#AF6C3E] rounded-lg shadow-md hover:shadow-lg" onClick={ async () => { await signIn('kakao',{callbackUrl:'http://localhost:8081/login/oauth2/code/kakao'})}}>독후감 기록하기</div>
)}
          </div>
        </div>
        <div className="flex justify-center">
          <Image src={mainLogo} alt="메인 로고" style={{ width: '200px' }} />
        </div>
      </div>
      {/* <div>읽는곳곳</div>
      <div onClick={fetchData}>on</div>
      <h1>누구나 볼 수 있는 페이지</h1>
      <LogoutButton></LogoutButton>
      {session.data ? (
        <div>
          {session.data.user?.name}
          <Image
            src={session.data.user?.image!}
            width={100}
            height={100}
            alt="Picture of the author"
          />
          <div></div>
        </div>
      ) : (
        <>
          <div>로그인된 정보 X</div>
        </>
      )} */}
      <div className='mx-auto max-w-5xl'>
      <div className="text-center ">
        <div className="text-2xl font-display font-bold py-10">
          이런 장소는 어때요?
        </div>
        {documents.length !== 0 ? (
          <MapView
            myMapData={documents}
            isShared={true}
            isFull={`400px`}
            markerImage={markerImage}
            markerImageOpacity={markerImageOpacity}
          ></MapView>
        ) : (
          <div>
            <div id="map" style={{ display: 'none' }}></div>
            <div>독서 기록을 남기고 지도를 확인하세요</div>
          </div>
        )}
      </div>
      {/* <SlideCarousel /> */}

      <div className="mt-10">
        <div className="text-2xl font-display font-bold py-10">내 서재</div>
        <BookLayout isMain={true}></BookLayout>
      </div>
      <div className="">
        <div className="flex justify-between">
          <span>모든 기록</span>
          <span>
            <Link href={'/reviews'}>더 보기</Link>
          </span>
        </div>
        {mainReviews.length === 0 ? (
          <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
            <section className="pt-16">
              <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                <h1 className="text-4xl">등록된 리뷰가 없습니다</h1>
              </div>
            </section>
          </div>
        ) : (
          mainReviews.map((item: any) => (
            <Link
              href={`/review/${item.id}`}
              key={item.id}
              onClick={() => setSelectedReview(item)}
            >
              <h1>모든 기록</h1>
              <div className="w-80 h-80 border border-slate-200 bg-slate-200 relative">
                <div className="absolute transform -translate-y-1/2 md:left-20 top-1/2 mx-8">
                  <div className="text-white text-left">
                    <h1 className="text-3xl md:text-5xl font-bold"></h1>
                    <p className="py-4 md:text-2xl"></p>
                    <div>책 이미지</div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
        </div>
        </div>
    </div>
  )
}
