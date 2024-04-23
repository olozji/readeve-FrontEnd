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
import placeImage from '/public/images/placeImage.jpg';
import mainFrame from '/public/images/mainFrame.png';
import frameImage from '/public/images/frameImage.png';
import { BookLayout } from './components/bookLayout'
import NavBar from './components/NavBar'
import CustomModal from './components/modal'
import ModalContent from './components/detailModal'
import LoginBtn from './components/buttons/LoginButton';
import LikeButton from './components/buttons/LikeButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Button from "@/app/components/buttons/button";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';


export default function Home() {
  let session: any = useSession()
  const [isLogin, setIsLogin] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
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
  const [selectedCount, setSelectedCount] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [sharedReview, setSharedReview] = useState(null)
  const [smallTagShow, setSmallTagShow] = useState(false)
  const [activeBookMark, setActiveBookMark] = useState(false);

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
      Math.min(tagData.length - numVisibleBooks, startIdx + numVisibleBooks),
    )
  }

  const handleChange = (index: any) => {
    setCurrentIndex(index)
  }

  const handleBookMark = () => {
    setActiveBookMark((prevBookMark) => !prevBookMark)
  }

  const handleCountClick = (index:number) => {
    setSelectedCount((prevState) => {
      const clickCount = [...prevState];
      clickCount[index] = !clickCount[index]
      return clickCount;
    });
  }

  const toggleLoginStatus = () => {
    setIsLogin((prevLogin) => !prevLogin)
  }

  const getTopVisitedPlaces = () => {
    // publicReviews 에서 가장 많이 중복된 장소명를 기준으로 카운트
    const visitCounts = publicReviews.reduce((counts: any, review: any) => {

      const placeName = review.pinRespDto.name
      counts[placeName] = (counts[placeName] || 0) + 1
      return counts
    }, {})

    // 방문 횟수를 기준으로 내림차순으로 정렬
    const sortedPlace = Object.keys(visitCounts).sort(
      (a, b) => visitCounts[b] - visitCounts[a],
    )

    return sortedPlace.slice(0, 3).map((placeName) => ({
      name: placeName,
      visitCount: visitCounts[placeName],
    }))
  }

  const handlePlaceClick = (place:any, i:any) => {
    
    console.log('장소 클릭:', place);
    const placeReview = publicReviews.find((review:any) => review.pinRespDto.name == place.name);
    
    console.log(placeReview);
    const mapLink = `/map/?placeId=${placeReview.pinRespDto.placeId}`;

    console.log(mapLink);
    window.location.href = mapLink;
  };

  const topVisitedPlaces = getTopVisitedPlaces()

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
  const fetchReviewId = async () => {
    if (session.data.user.id) {
      
      try {
        const response = await axios.get(
          'https://api.bookeverywhere.site/api/review/1',
        )
        const data = response.data.data // 응답으로 받은 데이터
  
     console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
   
  }
  const fetchTag = async () => {
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/tags`,
      )
      const data = response.data.data
      setTagInfo(data)

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
    if (session) {
      fetchPersonalData()
      fetchReviewId()
    }
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
  const closeLoginModal = () => {
    setIsLoginOpen(false)
  }

  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth
      if (screenWidth < 819) {
        setSmallTagShow(true) // 화면이 작을 때
      } else {
        setSmallTagShow(false) // 큰 화면
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

  return (
    <div>
      <NavBar />
      {isLoginOpen &&
        <CustomModal onClose={closeLoginModal} isOpen={true} size={'30rem'}>
          <div className="p-[2rem]">
            <div className="font-bold text-2xl">로그인</div>
            <div className="text-xs text-[#E57C65] py-2">
              <h1>로그인을 하고 모든 기능을 이용해 보세요</h1>
              <h1>필요한 시간은 단 3초!</h1>
            </div>
            <LoginBtn onLogin={toggleLoginStatus} />
          </div>
        </CustomModal>}
      
      <div
        className="relative w-full bg-cover py-24 sm:py-8 sm:px-5 grid sm:grid-flow-row-dense items-center sm:grid-cols-3 sm:grid-rows-1 px-[25%]"
        style={{
          backgroundImage: `url(${mainFrame.src})`,
        }}
      >
        <div className="relative z-10 text-start sm:col-span-2 py-4">
        <div className="relative z-10 sm:col-span-2 py-4">
          <div className="text-black text-center text-3xl sm:text-2xl  font-bold mb-2">
            어느 지역에서 독서를 하시나요?
          </div>
          <div className="text-black text-center text-sm sm:text-[10px] font-bold sm:mb-4 mb-10">
            여러분의 독서장소를 찾아드립니다.
          </div>
          <div className="text-center">
            <TextField
                id="search"
                label="독서 장소 검색하기"
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
                className="w-[20vw] bg-white rounded-2xl"
            />
          </div>
          <div className="mx-auto mt-10 w-[6vw] shadow-xl text-sm">
            <Button label="현재 위치 검색" outline={true}/>
          </div>
        </div>
      </div>
      </div>

      <div className="mx-auto max-w-5xl ">
        <div className="text-center">
          <div className="text-2xl font-display font-bold pt-10 pb-8">
            이런 장소는 어때요?
          </div>

          {!smallTagShow && (
            <div className="flex flex-wrap items-center justify-center mb-10 text-sm">
              <div className="p-2 cursor-pointer" onClick={handleClickPrev}>
                &lt;
              </div>
              {tagData.length > 0 &&
                tagData
                  .slice(startIdx, startIdx + numVisibleBooks)
                  .map((tag: any, i: number) => (
                    <div
                      key={i}
                      className={`box-border flex justify-center items-center px-4 py-2 my-2 mx-2 border border-gray-300 rounded-full ${isSelectedTags[startIdx + i] ? 'bg-[#E57C65] text-white' : 'bg-white hover:border-[#C05555] hover:text-[#C05555]'}`}
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
          )}
          {smallTagShow && (
            <div>
              <div className="text-sm text-[#E57C65]">
                슬라이드해서 태그를 선택해보세요
              </div>

              <div className="flex scrollBar flex-nowrap min-h-[7vh] mb-10 text-sm overflow-x-auto">
                {tagData.length > 0 &&
                  tagData.map((tag: any, i: number) => (
                    <div
                      key={i}
                      className={`box-border flex justify-center whitespace-nowrap items-center px-4 py-2 my-2 mx-2 border border-gray-300 rounded-full ${isSelectedTags[i] ? 'bg-[#E57C65] text-white' : 'bg-white hover:border-[#C05555] hover:text-[#C05555]'}`}
                      onClick={() => {
                        searchTag(i)
                      }}
                    >
                      {tag.content}
                    </div>
                  ))}
              </div>
            </div>
          )}

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
          <div className='py-10 sm:py-6 p-5 mb-3 sm:p-0 border rounded-lg relative sm:shadow-none'>
            <div className="text-xl sm:text-xl font-display font-bold ">인기 독서 장소</div>
            <div className='flex mt-10 gap-2'>
              <div className="w-[9vw] h-[25vh] rounded-10">
                <div className='relative'>
                <img src={frameImage.src} className='object-cover h-[25vh]'/>
                <div className='absolute top-1 right-2 cursor-pointer' onClick={handleBookMark}>
                  {activeBookMark ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                </div>
                <div className='absolute bottom-3 mx-3 text-white leading-3'>
                <div className='font-bold text-sm'>수지구청역 스타벅스</div>
                  <div className='text-xs'>용인, 수지구 카페</div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:px-5">
          <div className='py-10 sm:py-6 p-5 mb-3 sm:p-0 border rounded-lg relative sm:shadow-none'>
            <div className="text-xl sm:text-xl font-display font-bold ">오늘의 독서장소</div>
            <div className='flex mt-10 gap-2'>
              <div className="w-[9vw] h-[25vh] rounded-10">
                <div className='relative'>
                <img src={frameImage.src} className='object-cover h-[25vh]'/>
                <div className='absolute top-1 right-2 cursor-pointer' onClick={handleBookMark}>
                  {activeBookMark ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                </div>
                <div className='absolute bottom-3 mx-3 text-white leading-3'>
                <div className='font-bold text-sm'>수지구청역 스타벅스</div>
                  <div className='text-xs'>용인, 수지구 카페</div>
                </div>
              </div>
              </div>
            </div>
          </div>
          </div>

          <div className="mt-10 sm:px-5">
          <div className='py-10 sm:py-6 p-5 mb-3 sm:p-0 border rounded-lg relative sm:shadow-none'>
            <div className="text-xl sm:text-xl font-display font-bold ">이런장소는 어때요?</div>
            {session.data ? (
              // 로그인된 상태
              <div className='flex mt-10 gap-2'>
              <div className="w-[25vw] h-[25vh] rounded-10">
                <div className='relative'>
                <img src={placeImage.src} className='object-cover w-[25vw] h-[25vh]'/>
                <div className='absolute top-1 right-2 cursor-pointer' onClick={handleBookMark}>
                  {activeBookMark ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                </div>
                <div className='absolute bottom-3 mx-3 text-white leading-3'>
                <div className='font-bold text-sm'>수지구청역 스타벅스</div>
                  <div className='text-xs'>용인, 수지구 카페</div>
                </div>
              </div>
              </div>
            </div>            
            ) : (
              // 비로그인 상태
              <div className='flex mt-10 gap-2'>
              <div className="w-[25vw] h-[25vh] rounded-10">
                <div className='relative'>
                    <div className='absolute w-full h-full' style={{ backdropFilter: 'blur(5px)' }}>
                      <div className='absolute top-20 left-20 text-white'>로그인을 하고 장소를 추천받아 보세요</div>
                      </div>
                <img src={placeImage.src} className='object-cover w-[25vw] h-[25vh]'/>
                <div className='absolute top-1 right-2 cursor-pointer' onClick={handleBookMark}>
                  {activeBookMark ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                </div>
                <div className='absolute bottom-3 mx-3 text-white leading-3'>
                <div className='font-bold text-sm'>수지구청역 스타벅스</div>
                  <div className='text-xs'>용인, 수지구 카페</div>
                </div>
              </div>
              </div>
              </div>
            )}
          </div>
          </div>

        <div className="mt-10 sm:px-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-xl font-display font-bold py-10">
              다른 사람의 독후감을 확인해 보세요!
            </h1>
            <span className="inline-block align-middle">
              <Link href={'/allreview'}>
                <Image src={moreIcon} alt={'moreIcon'} width={22} height={30} className='sm:[4vw]' />
              </Link>
            </span>
          </div>
          {documents.length === 0 ? (
            <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
              <section className="pt-16">
                <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <h1 className="text-4xl sm:text-sm">
                    등록된 리뷰가 없습니다
                  </h1>
                </div>
              </section>
            </div>
          ) : (
              <div className="grid sm:grid-cols-1 sm:w-[100%] grid-cols-2 gap-4 justify-between sm:justify-center items-center">
                {publicReviews.slice(0, 2).map((d: any, i: number) => (
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
                          <h1 className="font-black text-xl sm:text-sm">
                            {d.title}
                          </h1>
                          <div className="flex sm:max-w-[50vw] text-xs text-[#3C3C3C] items-start sm:text-xs sm:pr-2">
                            {d.pinRespDto.private ? (
                              <div>
                                독서장소: {maskName(d.writer)}님만의 장소
                              </div>
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
                                {d.content.length > 50
                                  ? `${d.content.slice(0, 50)}...`
                                  : d.content}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-6 right-4 sm:text-xs sm:bottom-2 justify-itmes-center">
                        {formatDateToYYMMDD(d.createdDate)}
                      </div>
                      <div className='flex items-center absolute bottom-4 right-4 z-50'>
                        <LikeButton reviewId={d.reviewId } socialId={session.data?.user.id} /> 
                      </div>
                    </div>
                  </div>
                ))}
              </div>

          )}
        </div>
        <div className="py-[10rem] text-center">
          <h1
            onClick={scrollToTop}
            className="cursor-pointer underline decoration-solid text-[#E57C65]"
          >
            △첫 화면으로 올라가기
          </h1>
        </div>
      </div>
    </div>
  )
}
