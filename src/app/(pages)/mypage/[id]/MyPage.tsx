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
import { table } from 'console'
import { allReviewDataState } from '@/store/writeAtoms'

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
  const session = useSession()

  let user: any = session.data?.user
  console.log(props.id)
  const [map, setMap] = useState<any>()

  const [marker, setMarker] = useState<any>()
  const [address, setAddress] = useState('')
  const [selectBook, setSelectBook] = useState<any[]>([])
  const [allReviewData, setAllReviewData] = useRecoilState(allReviewDataState)
  const [documents, setDocuments] = useState<any[]>([])


  useEffect(() => {
    if (allReviewData) {
      if (user) {
        const filteredData = allReviewData.filter(
          (data: any) => Number(user.id) === data.socialId,
        )
        setDocuments(filteredData)
        console.log(documents)
      }
      
    }
  }, [allReviewData])

  return (
    <section className="bg-[#F1E5CF] mx-auto">
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
        <div className="relative mx-auto justify-center text-center">
          <Image
            src={tableImage.src}
            className="inline-block text-center"
            alt={tableImage.src}
            width={1500}
            height={1500}
          />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
            <BookLayout bookData={user.id} isMain={true}></BookLayout>
          </div>
          <div>
            {documents.length !== 0 ? (
              <div className="absolute left-0 bottom-20 right-0 px-[20rem]">
                <Link href={`/map/${props.id}`}>내 지도 크게보기</Link>
                <MapView
                  isMain={true}
                  myMapData={documents}
                  isShared={false}
                  isFull={'600px'}
                  markerImage={props.markerImage}
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
        <div className="mt-10 mx-auto max-w-7xl">
          <h1 className="text-xl font-display font-bold">최근 기록순</h1>
          {documents.length === 0 ? (
            <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
              <section className="pt-16">
                <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <h1 className="text-4xl">
                    등록된 리뷰가 없어요. 리뷰를 등록해보세요!
                  </h1>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-3 justify-center items-center w-[80rem]">
                {documents.slice(0, 3).map((d: any, i: number) => (
                  <Link
                    key={i}
                    href={`/detail/${d.bookRespDto && d.bookRespDto.isbn ? d.bookRespDto.isbn.replace(' ', '') : ''}`}
                  >
                    <div className="flex flex-col items-center rounded-lg border-4 border-transparent p-4 cursor-pointer">
                      <div className="relative w-[25rem] h-[8.5rem] rounded-2xl">
                        <div className="mx-auto h-full border rounded-2xl shadow-xl bg-[#fcfcfc]">
                          <div className="text-left">
                            <div className="text-xl font-display font-bold px-5 py-5">
                              {d.bookRespDto?.title}
                            </div>
                            <div className="px-5">
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
