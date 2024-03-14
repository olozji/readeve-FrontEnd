'use client'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import AddPlace from './components/map'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  allReviewDataState,
  allReviewSelector,
  mainTagState,
  selectedReviewState,
  tagState,
} from '@/store/writeAtoms'
import axios from 'axios'
import { sessionState } from '@/store/AuthAtoms'
import LogoutButton from './components/buttons/LogoutButton'
import mainLogo from '/public/images/mainLogo.png'
import MapView from './(pages)/map/[id]/MapView'
import moreIcon from '/public/images/moreIcon.png'
import markerImage from '/public/images/marker1.png'
import privateMarker from '/public/images/privateMarker.png'
import isPrivatedIcon from '/public/images/isPrivatedIcon.png'
import isSharedIcon from '/public/images/isSharedIcon.png'
import { BookLayout } from './components/bookLayout'
import NavBar from './components/NavBar'
import CustomModal from './components/modal'

export default function Home() {
  let session: any = useSession()

  const [map, setMap] = useState(false)
  const [publicReviews, setPublicReviews] = useState<any[]>([])
  const [selectedReview, setSelectedReview] =
    useRecoilState(selectedReviewState)
  const allReviews = useRecoilValue(allReviewSelector)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tagInfo, setTagInfo] = useRecoilState(tagState)
  const [isSelectedTags, setIsSelectedTags] =
    useRecoilState<boolean[]>(mainTagState)
  const [documents, setDocuments] = useState<any>([])
  const [startIdx, setStartIdx] = useState(0)
  const [allReviewData, setAllReviewData] =
    useRecoilState<any>(allReviewDataState)
  const [myData, setMyData] = useState([])
  const [myPageData, setMyPageData] = useState<any>([])
  const [tagData, setTagData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sharedReview, setSharedReview] = useState(null)

  const numVisibleBooks = 4

  const [isModalOpen, setIsModalOpen] = useState<boolean[]>(
    Array(numVisibleBooks).fill(false),
  )

  function formatDateToYYMMDD(isoDateString: string) {
    const date = new Date(isoDateString)
    return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
  }

  const handleClickPrev = () => {
    setStartIdx(Math.max(0, startIdx - numVisibleBooks))
  }

  const handleClickNext = () => {
    setStartIdx(
      Math.min(
        publicReviews.length - numVisibleBooks,
        startIdx + numVisibleBooks,
      ),
    )
  }

  const handleChange = (index: any) => {
    setCurrentIndex(index)
  }

  const openModal = (idx: any) => {
    let copy = []
    for (let i = 0; i < isModalOpen.length; i++) {
      if (i == idx) {
        copy.push(!isModalOpen[i])
      } else {
        copy.push(isModalOpen[i])
      }
    }
    setIsModalOpen(copy)
    setSharedReview(idx)
  }

  function maskName(name: string) {
    if (name.length <= 2) {
      return name
    }
    const firstChar = name.charAt(0)
    const lastChar = name.charAt(name.length - 1)
    const maskedPart = '*'.repeat(name.length - 2)
    return firstChar + maskedPart + lastChar
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
  const fetchTag = async () => {
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/tags`,
      )
      const data = response.data.data
      setTagInfo(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  

  const fetchPersonalData = async () => {
    if (session.data.user.id) {
      try {
        const response = await axios.get(
          `https://api.bookeverywhere.site/api/data/all/${session.data.user.id}`,
        )
        const data = response.data.data
        setMyData(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    fetchData()
    fetchPersonalData()
    fetchTag()
    setMap(true)
  }, [])

  useEffect(() => {
    setTagData(tagInfo)
    setIsSelectedTags(new Array(tagInfo.length).fill(false))
  }, [tagInfo])

  useEffect(() => {
    fetchPersonalData()
  }, [session])

  useEffect(() => {
    // allReviewData 상태가 업데이트되면서 새로운 데이터로 필터링하여 다른 상태에 반영
    if (allReviewData.length !== 0) {
      const publicReviewData = allReviewData.filter(
        (item: any) => !item.private,
      )
      // setPublicReviews(publicReviewData)
      setPublicReviews(publicReviewData)
    }
  }, [allReviewData])

  useEffect(() => {
    // allReviewData 상태가 업데이트되면서 새로운 데이터로 필터링하여 다른 상태에 반영
    const filteredData = allReviewData.filter((d: any) => !d.pinRespDto.private)
    setDocuments(filteredData)
  }, [allReviewData])

  useEffect(() => {
    setMyPageData(myData)
  }, [myData])

  const searchTag = (i: number) => {
    let copy = [...isSelectedTags] // 이전 배열의 복사본을 만듦
    copy[i] = !copy[i] // 복사본을 변경
    setIsSelectedTags(copy) // 변경된 복사본을 상태로 설정
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <NavBar />
      <div
        className="relative w-full py-24 sm:px-10 grid sm:grid-cols-1 px-[25%] grid-cols-2 "
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
            {session.data ? (
              <Link
                href="/write"
                className=" bg-[#FFB988] text-white font-bold py-4 px-6 hover:bg-[#AF6C3E] rounded-lg shadow-md hover:shadow-lg"
              >
                독후감 기록하기
              </Link>
            ) : (
              <div
                className=" bg-[#FFB988] inline-block text-white font-bold py-4 px-6 hover:bg-[#AF6C3E] rounded-lg shadow-md hover:shadow-lg"
                onClick={async () => {
                  await signIn('kakao', {
                    callbackUrl:
                      'http://localhost:8081/login/oauth2/code/kakao',
                  })
                }}
              >
                독후감 기록하기
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Image src={mainLogo} alt="메인 로고" style={{ width: '200px' }} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="text-center ">
          <div className="text-2xl font-display font-bold py-10">
            이런 장소는 어때요?
          </div>
          <div className="flex flex-wrap justify-center mb-10 text-sm">
            {tagData.length > 0 &&
              tagData.map((tag: any, i: number) => (
                <div
                  key={i}
                  className={`box-border flex justify-center items-center px-4 py-2 my-2 mx-2 border border-gray-300 rounded-full ${isSelectedTags[i] ? 'bg-[#E57C65] text-white' : 'bg-white hover:border-[#C05555] hover:text-[#C05555]'}`}
                  onClick={() => {
                    searchTag(i)
                  }}
                >
                  {tag.content}
                </div>
              ))}
          </div>

          {documents.length !== 0 ? (
            <MapView
              myMapData={documents}
              isShared={true}
              isFull={`400px`}
              isMain={true}
              markerImage={markerImage}
            ></MapView>
          ) : (
            <div>
              <div id="map" style={{ display: 'none' }}></div>
              <div>독서 기록을 남기고 지도를 확인하세요</div>
            </div>
          )}
        </div>

        <div className="mt-10 sm:px-5">
          <div className="text-2xl font-display font-bold py-10">내 서재</div>
          {session.data ? (
            <BookLayout
              bookData={myPageData}
              width={'full'}
              isMain={true}
            ></BookLayout>
          ) : (
            <div>로그인 하고 내 서재 를 확인하세요</div>
          )}
        </div>
        <div className="mt-10 sm:px-5">
          <h1 className="text-2xl font-display font-bold py-10">재방문 장소를 확인해 보세요!</h1>
          {/* TODO: 추후 데이터 들어가야할 부분 */}
          <div className="">
            <div className="p-5 mb-3 rounded-lg shadow-xl">
            <div className="my-3 border-2 border-[#AE695A] rounded-lg shadow-lg">
              <div className='flex gap-10 sm:gap-4'>
                <span className='py-1 pl-5 font-bold'>1위</span>
                <span className='py-1 gap-4 font-bold'>장소명</span>
                <span className='flex w-[10rem] py-1 px-3 text-white  bg-gradient-to-r from-[#FFD6CD] to-[#E67D67] rounded-2xl'>
                  {}명
                  <Image
                    src={mainLogo}
                    alt='mainLogo'
                    width={20}
                    height={10}
                    className='relative right-0'
                  />
                  </span>
              </div>
            </div>
            <div className="my-3 border-[#AE695A] rounded-lg shadow-lg">
              <div className='flex gap-10 sm:gap-4'>
                <span  className='py-1 pl-5 font-bold'>2위</span>
                <span className='py-1 gap-4 font-bold'>장소명</span>
                <span className='w-[10rem] py-1 px-3 text-white bg-gradient-to-r from-[#FFD6CD] to-[#E67D67] rounded-2xl'>{}명</span>
              </div>
            </div>
            <div className="my-3 border-[#AE695A] rounded-lg shadow-lg">
              <div className='flex gap-10 sm:gap-4'>
                <span  className='py-1 pl-5 font-bold'>3위</span>
                <span className='py-1 gap-4 font-bold'>장소명</span>
                <span className='w-[10rem] py-1 px-3 text-white bg-gradient-to-r from-[#FFD6CD] to-[#E67D67] rounded-2xl'>{}명</span>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="mt-10 sm:px-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold py-10">다른 사람의 독후감을 확인해 보세요!</h1>
            <span className="inline-block align-middle">
              <Link href={'/allreview'}>
                <Image src={moreIcon} alt={'moreIcon'} width={22} height={30} />
              </Link>
            </span>
          </div>
          {documents.length === 0 ? (
            <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
              <section className="pt-16">
                <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <h1 className="text-4xl sm:text-sm">등록된 리뷰가 없습니다</h1>
                </div>
              </section>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="p-2 cursor-pointer" onClick={handleClickPrev}>
                &lt;
              </div>
              <div className="grid sm:grid-cols-1 sm:w-[100%] grid-cols-4 justify-center items-center">
                {publicReviews
                  .slice(startIdx, startIdx + numVisibleBooks)
                  .map((d: any, i: number) => (
                    <div key={i} onClick={() => openModal(i)}>
                      {/* 모든리뷰 상세 모달 */}
                      {isModalOpen && (
                        <CustomModal
                          size={'70rem'}
                          isOpen={isModalOpen[i]}
                          modalColor="#FEF6E6"
                        >
                          <div className="">
                            <div className="px-8 sm:px-2 py-8">
                              <div className="flex justify-center items-center">
                                <img
                                  src={
                                    d.bookRespDto.thumbnail
                                      ? d.bookRespDto.thumbnail
                                      : 'http://via.placeholder.com/120X150'
                                  }
                                  alt="책 표지"
                                  className="w-[10rem] mb-2 rounded object-fll"
                                />
                                <div className="p-10 sm:p-0">
                                  <div className="text-xl font-extrabold text-[#6F5C52]">
                                    {d.bookRespDto.title}
                                  </div>
                                  <div className="text-sm font-bold text-[#9C8A80]">
                                    | {d.bookRespDto.author} 저자
                                  </div>
                                  <div className="justify-center items-center py-2">
                                    <span
                                      className={`inline-flex justify-center items-center gap-2 rounded-lg px-2 py-2 text-xs ${
                                        d.private
                                          ? 'bg-[#E57C65] text-white'
                                          : 'bg-white text-[#6F5C52]'
                                      }`}
                                    >
                                      <Image
                                        src={
                                          d.private
                                            ? isPrivatedIcon
                                            : isSharedIcon
                                        }
                                        alt="Icon"
                                        width={10}
                                        height={10}
                                      />
                                      {d.private ? '나만보기' : '전체공개'}
                                    </span>
                                  </div>
                                  <div className="py-5 pt-5 text-[#503526] text-sm">
                                    <div className="flex items-center gap-5">
                                      <span
                                        className="font-bold"
                                        style={{ verticalAlign: 'middle' }}
                                      >
                                        등록일
                                      </span>
                                      <div className="">
                                        {formatDateToYYMMDD(d.createAt)}
                                      </div>
                                    </div>

                                    <div className="flex">
                                      <span
                                        className="font-bold mr-4 sm:block sm:mr-0"
                                        style={{ verticalAlign: 'middle' }}
                                      >
                                        태그
                                      </span>
                                      <div className="flex flex-wrap w-[16vw] sm:w-[40vw]">
                                        {d.tags.map(
                                          (tag: any) =>
                                            tag.selected && (
                                              <div className="flex bg-[#E57C65] rounded-full m-1 p-2 text-white font-semibold text-xs">
                                                #{tag.content}
                                              </div>
                                            ),
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-5 sm:gap-0">
                                      <span
                                        className="font-bold"
                                        style={{ verticalAlign: 'middle' }}
                                      >
                                        장소
                                      </span>
                                      <Link
                                        href={`/map/${session.data?.user.id}`}
                                      >
                                        <div className="flex items-center sm:items-start">
                                          <Image
                                            src={privateMarker}
                                            alt={'장소'}
                                          />
                                          {d.pinRespDto.private ? (
                                            <div>
                                              {maskName(d.writer)}님만의 장소
                                            </div>
                                          ) : (
                                            <div className="sm:w-[40vw]">
                                              독서장소: {d.pinRespDto?.name} |{' '}
                                              {d.pinRespDto?.address}
                                            </div>
                                          )}
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-center items-center">
                                <div
                                  key={i}
                                  className="w-[50vw] sm:w-[90vw] my-4 rounded-lg overflow-hidden shadow-lg px-3 py-3 sm:pt-0 p-10 bg-[#FFFCF9]"
                                >
                                  <div className="mt-10 px-5">
                                    <h2 className="text-2xl font-bold mb-4 border-black border-b pb-5 text-[#503526]">
                                      {d.title}
                                    </h2>
                                    <div
                                      className="h-[45vh] mx-auto text-[#999999]"
                                      dangerouslySetInnerHTML={{
                                        __html: d.content.replace(
                                          /\n/g,
                                          '<br>',
                                        ),
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CustomModal>
                      )}
                      {/* 모든 리뷰 */}
                      <div className="flex flex-col items-center rounded-lg border-4 border-transparent p-4 sm:p-0 cursor-pointer">
                        <div className="relative w-[15rem] h-[12rem] sm:h-auto rounded-2xl">
                          <div className="mx-auto h-full border rounded-2xl shadow-xl bg-[#fcfcfc]">
                            <div className="text-left">
                              <div className="text-xl font-display font-bold px-5 py-5">
                                {d.bookRespDto?.title}
                              </div>
                              <div className="px-5 sm:pb-4">
                                {d.content.length > 20
                                  ? `${d.content.slice(0, 20)}...`
                                  : d.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="p-2 cursor-pointer" onClick={handleClickNext}>
                  &gt;
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="py-[10rem] text-center">
          <h1
            onClick={scrollToTop}
            className="cursor-pointer underline decoration-solid"
          >
            △첫 화면으로 올라가기
          </h1>
        </div>
      </div>
    </div>
  )
}
