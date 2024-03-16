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
import ModalContent from './components/detailModal'

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

  const numVisibleBooks = 5

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
        tagData.length - numVisibleBooks,
        startIdx + numVisibleBooks,
      ),
    )
  }

  const handleChange = (index: any) => {
    setCurrentIndex(index)
  }

  const getTopVisitedPlaces = () => {
    // publicReviews 에서 가장 많이 중복된 장소명를 기준으로 카운트
    const visitCounts = publicReviews.reduce((counts:any, review:any) => {
      console.log(publicReviews);
      console.log(allReviewData);
      const placeName = review.pinRespDto.name
      counts[placeName] = (counts[placeName] || 0) + 1;
      return counts;
    
    }, {});
  
    // 방문 횟수를 기준으로 내림차순으로 정렬
    const sortedPlace = Object.keys(visitCounts).sort((a, b) => visitCounts[b] - visitCounts[a]);
  
    return sortedPlace.slice(0, 3).map(placeName => ({
      name: placeName,
      visitCount: visitCounts[placeName]
    }));
  }

  const topVisitedPlaces = getTopVisitedPlaces();
  

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
    const topVisitedPlaces = allReviewData.filter(
      (item:any) => item.pinRespDto.name,
    )
    setPublicReviews(documents)
  },[topVisitedPlaces])

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
          <div className="text-2xl font-display font-bold pt-10 pb-8">
            이런 장소는 어때요?
          </div>
          <div className="flex flex-wrap items-center justify-center mb-10 text-sm">
          <div className="p-2 cursor-pointer" onClick={handleClickPrev}>
                  &lt;
                </div>
            {tagData.length > 0 &&
              tagData.slice(startIdx, startIdx + numVisibleBooks).map((tag: any, i: number) => (
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
            <div className="p-2 cursor-pointer" onClick={handleClickNext}>
                  &gt;
                </div>
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
              {topVisitedPlaces.map((place, index) => (
                 <div className="my-3 border-2 border-[#AE695A] rounded-lg shadow-lg">
                 <div className='flex justify-between gap-10 sm:gap-4'>
                   <span className='py-1 pl-5 w-[10vw] font-bold sm:text-xs sm:w-[20vw]'>{index + 1}위</span>
                   <span className='py-1 gap-4 w-[30vw] font-bold sm:text-xs sm:w-[50vw]'>{place.name}</span>
                   <div className='flex'>
                   <span className='relative flex w-[30vw] py-1 px-3 text-white  bg-gradient-to-r from-[#FFD6CD] to-[#E67D67] rounded-l-2xl sm:text-xs sm:w-[30vw]'>
                     <div className='flex justify-between absolute right-2 gap-4'>
                    {index === 0 && (
                      <>
                      {index === 0 && `${place.visitCount}명`}
                        <Image
                        src={mainLogo}
                        alt='mainLogo'
                        width={30}
                        height={10}
                        className='gap-5 sm:w-[5vw]'
                      />
                      </>
                    )}
                      {index !== 0 && `${place.visitCount}명`}
                     </div>
                     </span>
                   </div>
                 </div>
               </div>
              ))}
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
              
              <div className="grid sm:grid-cols-1 sm:w-[100%] grid-cols-2 gap-4 justify-center items-center">
                {publicReviews
                  .slice(0,2)
                  .map((d: any, i: number) => (
                    <div key={i} onClick={() => openModal(i)}>
                      {/* 모든리뷰 상세 모달 */}
                      {isModalOpen && (
                        <CustomModal
                          size={'70rem'}
                          isOpen={isModalOpen[i]}
                          modalColor="#FEF6E6"
                        >
                         <ModalContent
                          bookData={publicReviews}
                          data={publicReviews[i]}
                          sessionUserId={session.data?.user.id}
                          handleRemove={() => {}}
                          closeModal={() => openModal(i)}
                     />
                        </CustomModal>
                      )}
                      {/* 모든 리뷰 */}
                      <div className="relative flex p-6 sm:px-2 min-h-40 border shadow-lg rounded-2xl w-full">
                          <div
                            className="bg-contain sm:min-w-[8rem] w-[8rem] bg-no-repeat bg-center rounded-3xl"
                            style={{
                              backgroundImage: `url(${d.bookRespDto?.thumbnail})`,
                            }}
                          ></div>

                          <div className="flex flex-col ml-2">
                            <div className="">
                              <h1 className="font-black text-xl w-[15vw] sm:text-md">
                                {d.title}
                              </h1>
                              <div className="flex sm:max-w-[50vw] text-xs text-[#3C3C3C] items-start sm:text-xs sm:pr-2">
                                {d.pinRespDto.private ? (
                                  <div>독서장소: {maskName(d.writer)}님만의 장소</div>
                                ) : (
                                  <div className="">
                                    독서장소: {d.pinRespDto?.name} |{' '}
                                    {d.pinRespDto?.address}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex">
                            <div className="py-6 sm:pr-4 text-sm text-[#767676] sm:text-xs">
                                {d.content.length === 0 ? (
                                  <div>등록된 내용이 없습니다</div>
                                ) : (
                                  <div>
                                    {d.content.length > 100
                                      ? `${d.content.slice(0, 100)}...`
                                      : d.content}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-6 right-4 sm:text-xs sm:bottom-2 justify-itmes-center">
                            {formatDateToYYMMDD(d.createAt)}
                          </div>
                        </div>
                    </div>
                  ))}
              </div>
              <div className="flex items-center justify-center">
              
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
