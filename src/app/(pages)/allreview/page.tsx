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

import axios from 'axios'
import { useSession } from 'next-auth/react'
import ModalContent from '@/app/components/detailModal'
import { GoBackButton } from '@/app/components/buttons/goBackButton'
import LikeButton from '@/app/components/buttons/LikeButton'
import {updateInitialEnv} from "@next/env";

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
  const [filteredReview, setFilteredReview] = useState<ReviewData[]>([]);
  const [detailOpen, setDetailOpen] = useState<boolean[]>(
    Array(publicReviews.length).fill(false),
  )

  const [allReviewData, setAllReviewData] =
    useRecoilState<any>(allReviewDataState)

  const filterReview = useRecoilValue(filterReviewState);

  let session: any = useSession()

  const sortFilterRecentReview = (reviews: ReviewData[]) => {
    return reviews.slice().sort((a,b) => {
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
  }

  const sortFilterOldReview = (reviews: ReviewData[]) => {
    return reviews.slice().sort((a,b) => {
      return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
    })
  }

  const updatedFilterReviews = (filterType: string) => {
    let filtered: ReviewData[] = [];
    console.log(filtered);
    if (filterType === '최신등록순') {
      filtered = sortFilterRecentReview([...publicReviews]);
    } else if (filterType === '오래된순') {
      filtered = sortFilterOldReview([...publicReviews]);
    }
    setFilteredReview(filtered);
  };

  console.log(filteredReview,'sdsddsdsddd');

  const handleRecentClick = () => {
    // 1. 현재 선택된 필터 확인
    console.log('최신등록순');


    updatedFilterReviews('최신등록순');

  };

  const handleOldClick = () => {
    // 1. 현재 선택된 필터 확인
    console.log('오래된순');


      updatedFilterReviews('오래된순');

  };


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
   fetchData()
  }, [])

  function maskName(name: string): string {
    if (name.length === 2) {
      return name.charAt(0) + '*';
    } else if (name.length > 2) {
      const firstChar = name.charAt(0);
      const lastChar = name.charAt(name.length - 1);
      const maskedPart = '*'.repeat(name.length - 2);
      return firstChar + maskedPart + lastChar;
    } else {
      return name;
    }
  }

  function formatDateToYYMMDD(isoDateString: string) {
    const date = new Date(isoDateString)
    return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const PublicReviewData = allReviewData.filter((item: any) => !item.private)
    setPublicReviews(PublicReviewData)
  }, [allReviewData])

  useEffect(() => {
    setFilteredReview(allReviewData)
  },[allReviewData])

  return (
    <>
      <NavBar />
      <div className="bg-[#f1e5cf] flex justify-center box-border min-h-full">
        <section className="pt-20 sm:pt-10">
        {/*<section className="main mx-auto max-w-6xl px-4">*/}
        <div className='absolute py-10 sm:hidden'>
        <GoBackButton/>
        </div>
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
                    <div
                      className="cursor-pointer"
                      onClick={handleRecentClick}>최신등록순</div>
                    <div
                      className="cursor-pointer"
                      onClick={handleOldClick}>오래된순</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 lg:pt-20">
              {filteredReview.length === 0 ? (
                <div className="blank pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <div className="pt-16">
                    <div className="mx-auto">
                      <h1 className="text-3xl sm:text-sm">등록된 리뷰가 없습니다</h1>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-0 md:grid-cols-1 lg:grid-cols-1 lg:pt-20 md:pt-20 sm:pt-20">
                  {filteredReview.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="w-[70vw] sm:w-full sm:max-w-[100%] my-4 sm:my-2 mx-auto rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleModal(i)}
                      >
                        {detailOpen && (
                          <CustomModal
                            size={'70rem'}
                            isOpen={detailOpen[i]}
                            modalColor="#FEF6E6"
                          >
                           <ModalContent
                            bookData={publicReviews}
                            data={publicReviews[i]}
                            sessionUserId={session.data?.user.id}
                            closeModal={() => handleModal(i)}
                          />
                          </CustomModal>
                        )}

                        <div className="relative flex p-4 sm:px-0 w-[100%] min-h-52 bg-[#FEF6E6] border-4 border-white rounded-2xl ">
                          <div
                            className="bg-auto sm:min-w-[8rem] w-[12rem] bg-no-repeat bg-center rounded-2xl "
                            style={{
                              backgroundImage: `url(${item.bookRespDto?.thumbnail})`,
                            }}
                          ></div>
                          <div className="flex flex-col justify-between ml-2">
                            <div className="">
                              <h1 className="font-black text-2xl sm:text-base">
                                {item.title}
                              </h1>
                              <div className="flex sm:max-w-[50vw] text-sm items-start sm:text-xs sm:pr-2">
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
                                    {item.pinRespDto?.address}
                                  </div>
                                )}
                              </div>
                              <div className='text-xs sm:pr-2'>책 이름 : {item.bookRespDto.title}</div>
                              <div className='text-xs sm:pr-2'>저자 : {item.bookRespDto.author}</div>

                            </div>
                            <div className="flex justify-between">
                            <div className="py-2 sm:pr-4 text-sm sm:text-xs">
                                {item.content.length === 0 ? (
                                  <div>등록된 내용이 없습니다</div>
                                ) : (
                                  <div className="sm:w-[30vw]">
                                    {item.content.length > 20
                                      ? `${item.content.slice(0, 20)}...`
                                      : item.content}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4 sm:text-xs sm:bottom-2 justify-items-center">
                            {formatDateToYYMMDD(item.createdDate)}
                          </div>
                          <div className='flex items-center absolute bottom-2 right-20 z-50 sm:right-0 sm:bottom-4'>
                            <LikeButton reviewId={item.reviewId } socialId={session.data?.user.id} />
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
