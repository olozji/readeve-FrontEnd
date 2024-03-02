'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  allDataState,
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
import axios from 'axios';


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
  const [detailOpen, setDetailOpen] = useState<boolean[]>(
    Array(publicReviews.length).fill(false),
  )

  const handleModal = (idx: number) => {
    setDetailOpen((prevState) => {
      const copy = [...prevState]
      copy[idx] = !copy[idx]
      return copy
    })
  }

  const closeReviewModal = () => {
    setSelectedReview(null)
    setIsReviewsModal(false)
  }

  // useEffect(() => {
  //   const storedData = localStorage.getItem('allDataInfo')

  //   if (storedData) {
  //     const parsedData: ReviewData[] = JSON.parse(storedData)
  //     const PublicReviewData = parsedData.filter(
  //       (item: ReviewData) => !item.isPrivate,
  //     )
  //     console.log(PublicReviewData)
  //     setPublicReviews(PublicReviewData)
  //   }
  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.bookeverywhere.site/api/reviews'); 
        const data = response.data; // 응답으로 받은 데이터
      
        const PublicReviewData = data.filter((item: any) => !item.isPrivate)
        setPublicReviews(PublicReviewData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); 

  }, [])

  return (
    <>
      <NavBar />
      <div className="bg-[#f1e5cf]">
        <section className="main mx-auto max-w-6xl px-4 ">
          <section className="pt-20 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
            {/* <h2 className='mb-5 lg:mb-8 text-3xl lg:text-4xl text-center font-bold'>
                {categoryName}
            </h2> */}
            {/* <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                <a href="#" className="inline-flex items-center text-sm font-medium">
                    <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    홈
                </a>
            </li>
            <li>
      <div className="flex items-center">
        <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
        <a href="#" className="ml-1 text-sm font-medium">모든 공유기록 보기</a>
      </div>
    </li>
  </ol>
</nav> */}
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
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 lg:pt-20 md:pt-20">
                  {publicReviews &&
                    publicReviews.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="relative w-90 min-h-32  border rounded-md border-slate-200"
                        onClick={() => handleModal(i)}
                      >
                        {detailOpen && (
                          <CustomModal isOpen={detailOpen[i]} size={'60rem'}>
                            <div className="h-[50rem]">
                              <div className="px-8 py-8">
                                <div className="flex">
                                  <img
                                    src={
                                      publicReviews[i].book?.thumbnail
                                        ? publicReviews[i].book?.thumbnail
                                        : 'http://via.placeholder.com/120X150'
                                    }
                                    alt="책 표지"
                                    className="w-[14rem] mb-2 rounded object-fll"
                                  />
                                  <div>
                                    <h1 className="text-lg font-extrabold">
                                      {item.title}
                                    </h1>
                                    <div className="flex gap-4">
                                      <span>where</span>
                                      <div>{item.pinRespDto.name}</div>
                                    </div>
                                    <div className="flex gap-4">
                                      <span>when</span>
                                      <div>{item.pinRespDto.name}</div>
                                    </div>
                                    <div className="flex gap-4">
                                      <span>tags</span>
                                      {item.tags.map(
                                        (data: any) =>
                                          data.selected && (
                                            <div>{data.content}</div>
                                          ),
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex relative left-[35rem] w-[10rem] gap-4">
                                  <Link href={'/edit/1'}>
                                    <Button label="수정" outline={true} />
                                  </Link>
                                  <Button label="삭제" outline={false} />
                                </div>
                                <div className="h-[30rem] border border-slate-200 rounded-md bg-slate-200">
                                  {item.content}
                                </div>
                              </div>
                            </div>
                          </CustomModal>
                        )}
                        <div className="relative flex p-4 w-full min-h-52 bg-[#fff9f6] rounded-2xl ">
                          <div
                            className="bg-auto w-[12rem] bg-no-repeat bg-center rounded-2xl "
                            style={{
                              backgroundImage: `url(${item.book?.thumbnail})`,
                            }}
                          ></div>
                          <div className="flex flex-col justify-between ml-2">
                            <div className=" py-2">
                              <h1 className="font-bold text-2xl">
                                {item.title}
                              </h1>
                              <div className="py-2 text-sm">
                              {item.content.length === 0 ? (
                                <div>등록된 내용이 없습니다</div>
                              ) : (
                                <div>
                                  {item.content.length > 100
                                    ? `${item.content.slice(0, 100)}...`
                                    : item.content}
                                </div>
                              )}
                            </div>
                            </div>

                          <div className='flex justify-between'>
                            <div className="flex text-sm pb-2">
                              <Image src={privateMarker} alt='marker' className='mr-2' />
                              {item.pinRespDto.isPrivate ? <div>{item.writer}님만의 장소</div>:<div className="">독서장소: {item.pinRespDto?.name} | {item.pinRespDto?.address }</div>}
                              
                              </div>
                              </div>
                          </div>
                          <div className='pb-2 absolute right-8 bottom-4 text-end text-sm'>23.03.01</div>
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
