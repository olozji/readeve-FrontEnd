'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  allDataState,
  allReviewDataState,
  bookState,
  filterReviewState,
  getReviewData,
  reviewState,
  selectedReviewState,
} from '@/store/writeAtoms'
import CustomModal from '@/app/components/modal'
import NavBar from '@/app/components/NavBar'
import Button from '@/app/components/buttons/button'

import Image from 'next/image'
import privateMarker from '/public/images/privateMarker.png'
import isPrivatedIcon from '/public/images/isPrivatedIcon.png'
import isSharedIcon from '/public/images/isSharedIcon.png'

import axios from 'axios'
import { useSession } from 'next-auth/react'


export interface ReviewData {
  [x: string]: any
  id?: number
  date?: string
  title?: string
  pinRespDto?: any
  category?: string
  description?: string
  isFavorite?: boolean
  image?: string
  tag?: {
    rate?: number
    count?: number
  }
  private?: boolean
  book?: {
    isbn: string
    title: string
    thumbnail: string
    content: string
    isPrivate: boolean
  }
}

const AllReviewPage = () => {
  const [categoryName, setCategoryName] = useState('')
  const [publicReviews, setPublicReviews] = useState<ReviewData[]>([])
  const [selectedReview, setSelectedReview] =
    useRecoilState(selectedReviewState)
  const [isReviewsModal, setIsReviewsModal] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])

  const [detailOpen, setDetailOpen] = useState<boolean[]>(
    Array(publicReviews.length).fill(false),
  )

  const [allReviewData, setAllReviewData] = useRecoilState<any>(allReviewDataState)

  
  let session: any = useSession()
  
  const handleModal = (idx: number) => {
    setDetailOpen((prevState) => {
      const copy = [...prevState]
      copy[idx] = !copy[idx]
      return copy
    })
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.bookeverywhere.site/api/data/all?isPrivate=false',
      )
      const data = response.data.data // 응답으로 받은 데이터

      // 원본 배열을 복사하여 수정
      const newData = [...data]

      // 수정된 데이터를 상태에 반영
      setAllReviewData(newData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo')

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      
      setDocuments(parsedData)
    }
  }, [])

function maskName(name:string) {
  if (name.length <= 2) {
      return name;
  }
  const firstChar = name.charAt(0);
  const lastChar = name.charAt(name.length - 1);
  const maskedPart = "*".repeat(name.length - 2);
  return firstChar + maskedPart + lastChar;
}

  function formatDateToYYMMDD(isoDateString:string) {
    const date = new Date(isoDateString);
    return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
}

  useEffect(() => {
    
    setPublicReviews(documents)
  }, [documents])

  return (
    <>
      <NavBar />
      <div className="bg-[#f1e5cf]">
      
        <section className="main mx-auto max-w-6xl px-4">
          <section className="pt-20 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
          <div className="text-center mt-4 mx-auto myCustomText text-3xl text-white">
            모든 기록
          </div>
            <div className="lg-pt-10 md-pt-10 relative">
              <div className="absolute left-0">
                <div className="flex py-4 md:py-8">
                  <div
                    id="filter"
                    className=" flex gap-3 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  >
                    <div>최신등록순</div>
                    <div>오래된순</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 lg:pt-20">
              {publicReviews.length === 0 ? (
                <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <div className="pt-16">
                    <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                      <h1 className="text-4xl">등록된 리뷰가 없습니다</h1>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 lg:pt-20 md:pt-20 sm:pt-20 sm:gap-0">
                  {publicReviews &&
                    publicReviews.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="max-w-3xl my-4 mx-auto rounded-lg overflow-hidden"
                        onClick={() => handleModal(i)}
                      >

                        {detailOpen && (
                          <CustomModal size={'70rem'} isOpen={detailOpen[i]} modalColor='#FEF6E6'>
                          <div className="">
                            <div className="px-8 py-8">
                              <div className="flex justify-center items-center">
                                <img
                                  src={
                                    publicReviews[i].bookRespDto.thumbnail
                                      ? publicReviews[i].bookRespDto.thumbnail
                                      : 'http://via.placeholder.com/120X150'
                                  }
                                  alt="책 표지"
                                  className="w-[10rem] mb-2 rounded object-fll"
                                />
                                <div className='p-10'>
                                  <div className="text-xl font-extrabold text-[#6F5C52]">
                                    {item.bookRespDto.title}
                                  </div>
                                  <div className="text-sm font-bold text-[#9C8A80]">
                                    | {publicReviews[i].bookRespDto.author} 저자
                                  </div>
                                  <div className="justify-center datas-center py-2">
                                  <span
                                  className={`inline-flex justify-center datas-center gap-2 rounded-lg px-2 py-2 text-xs ${
                                    item.isPrivate ? 'bg-[#E57C65] text-white'  : 'bg-white text-[#6F5C52]'
                                  }`}
                                >
                                <Image
                                  src={item.isPrivate ? isPrivatedIcon : isSharedIcon}
                                  alt='Icon'
                                  width={10}
                                  height={10}
                                />
                                  {item.isPrivate ? '나만보기' : '전체공개'}
                                  </span>
                                  </div>
                                 <div className='py-5 pt-5 text-[#503526] text-sm'>
                                  <div className="flex datas-center gap-5">
                                    <span className='font-bold' style={{ verticalAlign: 'middle' }}>등록일</span>
                                    <div className=''>{formatDateToYYMMDD(item.createAt)}</div>
                                  </div>
                                  {/* TODO: 태그 부분 수정 필요함 컴포넌트를 직접 가져와서 해야할지? 아직 안해봤어요 */}
                                  <div className="flex">
                                    <span className='font-bold mr-4' style={{ verticalAlign: 'middle' }}>태그</span>
                                    <div className='flex flex-wrap w-[16vw]'>
                                    {item.tags.map(
                                      (tag: any) =>
                                        tag.selected && <div className='flex bg-[#E57C65] rounded-full m-1 p-2 text-white font-semibold text-xs'>#{tag.content}</div>,
                                    )}
                                  </div>
                                  </div>
                                  <div className="flex datas-center gap-5">
                                  <span className='font-bold' style={{ verticalAlign: 'middle' }}>장소</span>

                                    <div 
                                      className='flex datas-center'>
                                      <Image
                                        src={privateMarker}
                                        alt={'장소'}
                                      />
                                      {item.pinRespDto.private ? (
                                      <div>{maskName(item.writer)}님만의 장소</div>
                                    ) : (
                                      <div className="">
                                        독서장소: {item.pinRespDto?.name} |{' '}
                                        {item.pinRespDto?.address}
                                      </div>
                                 )}
                                      </div>
                                      
                                  </div>
                                  </div>
                                </div>
                              </div>
                              {/* 내용 엔터키 적용 */}
                              <div className='flex justify-center datas-center'>
                              <div
                                key={i}
                                className="w-[50vw] my-4 rounded-lg overflow-hidden shadow-lg px-3 py-3 p-10 bg-[#FFFCF9]"
                              >
                                
                              <div className='mt-10 px-5'>
                              <h2 className="text-2xl font-bold mb-4 border-black border-b pb-5 text-[#503526]">{item.title}</h2>
                                <div className="h-[45vh] mx-auto text-[#999999]" dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br>') }}>
                                </div>
                                </div>
                            </div>
                            </div>
                            </div>
                          </div>
                        </CustomModal>
                        )}

                        <div className="relative flex p-4 w-full min-h-52 bg-[#fff9f6] rounded-2xl sm:p-2 sm:w-[85vw]">
                            <div className='relative'>
                            <div
                            className="bg-auto mb-2 absolute top-0 left-0 right-0 bottom-0 rounded object-fll bg-no-repeat bg-center overflow-hidden"
                            style={{
                              backgroundImage: `url(${item.bookRespDto?.thumbnail})`,
                              width:'150px',
                            }}
                          >
                            </div>
                          </div>
                          <div className="flex flex-col justify-between ml-2 sm:ml-[9rem]">
                            <div className="py-2">
                              <h1 className="font-bold text-2xl sm:text-xs sm:w-[30vw]">
                                {item.title}
                              </h1>
                              <div className="py-2 text-sm sm:text-xs">
                                {item.content.length === 0 ? (
                                  <div>등록된 내용이 없습니다</div>
                                ) : (
                                  <div className='p-0 sm:w-[30vw]'>
                                    {item.content.length > 20
                                      ? `${item.content.slice(0, 20)}...`
                                      : item.content}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <div className="flex text-sm pb-2 sm:text-xs items-center">
                                <Image
                                  src={privateMarker}
                                  alt="marker"
                                  className="mr-2"
                                />
                                {item.pinRespDto.private ? (
                                  <div>{maskName(item.writer)}님만의 장소</div>
                                ) : (
                                  <div className="">
                                    독서장소: {item.pinRespDto?.name} |{' '}
                                    {`${item.pinRespDto?.address.slice(0,10)}...`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid sm:absolute sm:bottom-2 sm:right-5 sm:text-xs justify-itmes-center">
                            {formatDateToYYMMDD(item.createAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </>
  )
}

export default AllReviewPage
