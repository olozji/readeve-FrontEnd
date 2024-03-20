'use client'

import { BookLayout } from '@/app/components/bookLayout'
import { markersState } from '@/store/mapAtoms'
import { useSession } from 'next-auth/react'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { PropType } from '../../detail/[id]/page'
import MapView from '../../map/[id]/MapView'
import Link from 'next/link'

import lampIcon from '/public/images/lampicon.png'
import tableImage from '/public/images/tableImg.png'
import tableImageSmall from '/public/images/tableImgSmall.png'
import bookIcon from '/public/images/bookIcon.png'
import NotesImg from '/public/images/notesImg.png'

import { table } from 'console'
import { allReviewDataState } from '@/store/writeAtoms'
import axios from 'axios'
import { GoBackButton } from '@/app/components/buttons/goBackButton'

declare global {
  interface Window {
    kakao: any
  }
}
interface ParamType {
  id: string
  markerImage: StaticImageData
}

const MyPageComponent = (props: ParamType) => {
  const session: any = useSession()

  let user: any = session.data?.user
  console.log(props.id)

  const [myData, setMyData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [myPageData, setMyPageData] = useState([])
  const [smallMap, setSmallMap] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/data/all/${props.id}`,
      )
      const data = response.data.data
      setMyData(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {

    fetchData()


}, [props.id,session])
  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth
      if (screenWidth < 819) {
        setSmallMap(true) // 화면이 작을 때
      } else {
        setSmallMap(false) // 큰 화면
      }
    }
    handleResize()
    // 창의 크기가 변경될 때마다 호출
    window.addEventListener('resize', handleResize)

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // 컴포넌트가 마운트될 때 한 번만 호출

  useEffect(() => {
    setMyPageData(myData)
  }, [myData])

  return (
    <section className="bg-[#F1E5CF] px-[15vw] sm:px-0">
      <div className='absolute py-20 z-50 sm:hidden'>
        <GoBackButton/> 
      </div>
      <div className="grid relative mx-auto justify-center text-center sm:mb-0 mb-10">
        <Image
          src={lampIcon.src}
          className="inline-block text-center"
          alt={lampIcon.src}
          width={150}
          height={100}
        />
        <div>
          <div className="absolute bottom-8 left-0 right-0 mx-auto myCustomText text-3xl text-white">
            내 서재
          </div>
        </div>
      </div>
      <section>
        {/* 웹 화면 */}
        <div className="relative w-[70vw] sm:hidden h-[100vh] justify-center text-center">
          <Image
            fill
            src={tableImage.src}
            className="inline-block text-center"
            alt={tableImage.src}
          />
          <div className="absolute top-[4%] left-1/2 max-w-[95%] transform -translate-x-1/2 z-10">
            
            <BookLayout
              bookData={myPageData}
              width={'[70vw]'}
              isMain={false}
            ></BookLayout>
          </div>
          {!smallMap && (
            <div className="absolute bottom-[2vh] sm:hidden left-1/2 min-h-[60%] min-w-[60vw] transform -translate-x-1/2 z-20">
              {myPageData.length !== 0 ? (
                <div>
                  <div className="flex gap-2 pb-[3%]">
                    <h1>나만의 지도</h1>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center max-h-10 rounded-lg gap-1 bg-[#FFFCF9] px-3 py-1 text-xs font-medium text-[#5F5F5F]">
                        <Image
                          src={bookIcon}
                          alt={'bookIcon'}
                          width={15}
                          height={15}
                        />
                        {`${new Set(myPageData.map((data: any) => data.bookRespDto.isbn)).size} 권`}
                      </span>
                      <span className="inline-flex items-center justify-center max-h-10 rounded-lg gap-1 bg-[#FFFCF9] px-3 py-1 text-xs font-medium text-[#5F5F5F]">
                        <Image
                          src={NotesImg}
                          alt={'NotesImg'}
                          width={15}
                          height={15}
                        />
                        {`${myPageData.length} 개`}
                      </span>
                    </div>
                  </div>
                  <MapView
                    isMain={true}
                    myMapData={myPageData}
                    isShared={false}
                    isFull={'50vh'}
                    markerImage={props.markerImage}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </div>
        {/* 모바일 화면 */}
        
        <div className="relative w-[100vw] md:hidden lg:hidden h-[60vh] justify-center text-center">
          <Image
            fill
            src={tableImageSmall.src}
            className="inline-block text-center"
            alt={tableImageSmall.src}
          />
          <div className="absolute top-[7%] left-1/2 max-w-[100%] transform -translate-x-1/2 z-10">
            <BookLayout
              bookData={myPageData}
              width={'[100vw]'}
              isMain={false}
            ></BookLayout>
          </div>
        </div>
        {smallMap && (
          <div className="px-5 md:hidden lg:hidden z-20">
            {myPageData.length !== 0 ? (
              <div>
                <div className="flex justify-between gap-2 pb-[3%]">
                  <h1 className='sm:text-sm font-bold'>나만의 지도</h1>
                  <div className="flex  items-center gap-3">
                    <span className="inline-flex items-center justify-center max-h-10 rounded-lg gap-1 bg-[#F8F3ED] px-3 py-1 text-xs font-medium text-[#5F5F5F]">
                      <Image
                        src={bookIcon}
                        alt={'bookIcon'}
                        width={15}
                        height={15}
                      />
                      {`${new Set(myPageData.map((data: any) => data.bookRespDto.isbn)).size} 권`}
                    </span>
                    <span className="inline-flex items-center justify-center max-h-10 rounded-lg gap-1 bg-[#F8F3ED] px-3 py-1 text-xs font-medium text-[#5F5F5F]">
                      <Image
                        src={NotesImg}
                        alt={'NotesImg'}
                        width={15}
                        height={15}
                      />
                      {`${myPageData.length} 개`}
                    </span>
                  </div>
                </div>
                <MapView
                  isMain={true}
                  myMapData={myPageData}
                  isShared={false}
                  isFull={'50vh'}
                  markerImage={props.markerImage}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        )}

        <div className="mt-10 mx-auto max-w-7xl sm:px-5">
          <h1 className="text-xl font-display font-bold sm:text-md">최근 기록순</h1>
          {myPageData.length === 0 ? (
            <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
              <section className="pt-16">
                <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <h1 className="text-xl sm:text-md">
                    등록된 리뷰가 없어요. 리뷰를 등록해보세요!
                  </h1>
                </div>
              </section>
            </div>
          ) : (
            <div className="">
              <div className="grid sm:grid-cols-1 grid-cols-3 justify-center items-center ">
                {myPageData.slice(0, 3).map((d: any, i: number) => (
                  <Link
                    key={i}
                    href={`/detail/${d.bookRespDto && d.bookRespDto.isbn ? d.bookRespDto.isbn.replace(' ', '') : ''}`}
                  >
                    <div className="flex flex-col items-center rounded-lg border-4 border-transparent p-4 sm:py-2 sm:px-0 cursor-pointer">
                      <div className="w-[100%] h-[15vh] rounded-2xl">
                        <div className="mx-auto h-full border rounded-2xl shadow-xl bg-[#fcfcfc]">
                          <div className="text-left">
                            <div className="text-xl font-display font-bold px-5 py-5 sm:text-md">
                              {d.bookRespDto?.title}
                            </div>
                            <div className="px-5 pb-5">
                              {d.content.length > 20
                                ? `${d.content.slice(0, 20)}...`
                                : d.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

export default MyPageComponent
