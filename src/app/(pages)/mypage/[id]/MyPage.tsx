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
import bookIcon from '/public/images/bookIcon.png'
import NotesImg from '/public/images/notesImg.png'

import { table } from 'console'
import { allReviewDataState } from '@/store/writeAtoms'
import axios from 'axios'

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

  const [map, setMap] = useState<any>()

  const [marker, setMarker] = useState<any>()
  const [address, setAddress] = useState('')
  const [selectBook, setSelectBook] = useState<any[]>([])

  const [myData, setMyData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
    window.onload = () => {
      fetchData()
    };
    
  }, [props.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <section className="bg-[#F1E5CF] px-[15vw]">
      <div className="grid relative mx-auto justify-center text-center mb-10">
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
      <div className="relative w-[70vw] h-[100vh] justify-center text-center" >
          <Image
            fill
            src={tableImage.src}
            className="inline-block text-center"
            alt={tableImage.src}
           
          />
          <div className="absolute top-[2%] left-1/2 max-w-[95%] transform -translate-x-1/2 z-10">
            <BookLayout bookData={myData} isMain={'[70vw]'}></BookLayout>
          </div>
          <div className="absolute bottom-[2vh] left-1/2 min-h-[60%] min-w-[60vw] transform -translate-x-1/2 z-20">
            {myData.length !== 0 ? (
              <div>
                <div className="flex gap-2 pb-[3%]">
                  <h1 >나만의 지도</h1>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center max-h-10 rounded-lg gap-1 bg-[#E1E1E1] px-3 py-1 text-xs font-medium text-[#5F5F5F]">
                      <Image
                        src={bookIcon}
                        alt={'bookIcon'}
                        width={15}
                        height={15}
                      />
                      {`${new Set(myData.map((data: any) => data.bookRespDto.isbn)).size} 권`}
                    </span>
                    <span className="inline-flex items-center justify-center max-h-10 rounded-lg gap-1 bg-[#E1E1E1] px-3 py-1 text-xs font-medium text-[#5F5F5F]">
                      <Image
                        src={NotesImg}
                        alt={'NotesImg'}
                        width={15}
                        height={15}
                      />
                      {`${myData.length} 개`}
                      
                    </span>
                  </div>
                </div>
                <MapView
                  isMain={true}
                  myMapData={myData}
                  isShared={false}
                  isFull={'50vh'}
                  markerImage={props.markerImage}
                />
              </div>
            ) : (
              
                <div className="bg-red-300 h-[50%]">
                  독서 기록을 남기고 나만의 지도를 확인해보세요:&#41;
                
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 mx-auto max-w-7xl">
          <h1 className="text-xl font-display font-bold">최근 기록순</h1>
          {myData.length === 0 ? (
            <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
              <section className="pt-16">
                <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <h1 className="text-xl">
                    등록된 리뷰가 없어요. 리뷰를 등록해보세요!
                  </h1>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-3 justify-center items-center w-[65vw]">
                {myData.slice(0, 3).map((d: any, i: number) => (
                  <Link
                    key={i}
                    href={`/detail/${d.bookRespDto && d.bookRespDto.isbn ? d.bookRespDto.isbn.replace(' ', '') : ''}`}
                  >
                    <div className="flex flex-col items-center rounded-lg border-4 border-transparent p-4 cursor-pointer">
                      <div className="w-[20vw] rounded-2xl">
                        <div className="mx-auto h-full border rounded-2xl shadow-xl bg-[#fcfcfc]">
                          <div className="text-left">
                            <div className="text-xl font-display font-bold px-5 py-5">
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
