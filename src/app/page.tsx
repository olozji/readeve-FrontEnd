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
import moreIcon from '/public/images/moreIcon.png';
import markerImage from '/public/images/marker1.png'
import markerImageOpacity from '/public/images/marker2.png'
import { BookLayout } from './components/bookLayout'
import NavBar from './components/NavBar';

export default function Home() {
  let session = useSession()
  console.log(session)

  const [map, setMap] = useState(false)
  const [publicReviews, setPublicReviews] = useState<any[]>([])
  const [selectedReview, setSelectedReview] =
    useRecoilState(selectedReviewState)
  const allReviews = useRecoilValue(allReviewSelector)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [documents, setDocuments] = useState<any[]>([])
  const [tagInfo, setTagInfo] = useRecoilState(tagState)
  const [isSelectedTags, setIsSelectedTags] =
    useRecoilState<boolean[]>(mainTagState)

  const [startIdx, setStartIdx] = useState(0)
  const [allReviewData, setAllReviewData] = useRecoilState<any>(allReviewDataState);
    
    const numVisibleBooks = 4;

  // useEffect(() => {
  //   const storedData = localStorage.getItem('allDataInfo')

  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData)
  //     const filteredData = parsedData.filter(
  //       (data: any) => !data.place.isPrivate,
  //     )
  //     setDocuments(filteredData)
  //   }
  // }, [])

  
  const handleClickPrev = () => {
    setStartIdx(Math.max(0, startIdx - numVisibleBooks))
  }

  const handleClickNext = () => {
    setStartIdx(
      Math.min(publicReviews.length - numVisibleBooks, startIdx + numVisibleBooks),
    )
  }

  const handleChange = (index: any) => {
    setCurrentIndex(index)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.bookeverywhere.site/api/data/all');
      console.log(response.data); // 서버에서 받은 데이터 출력
      const data = response.data.data; // 응답으로 받은 데이터
  
      // 원본 배열을 복사하여 수정
      const newData = [...data];
      newData.splice(-2, 2);
  
      // 수정된 데이터를 상태에 반영
      setAllReviewData(newData);
  
      // 상태 업데이트가 완료된 후에 데이터를 필터링하여 다른 상태에 반영
      if (newData.length !== 0) {
        const publicReviewData = newData.filter((item: any) => !item.private);
        setPublicReviews(publicReviewData);
      }
  
      const filteredData = newData.filter((d: any) => !d.pinRespDto.private);
      setDocuments(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  
  useEffect(() => {
    fetchData()
    setMap(true)
  }, [allReviewData])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('https://api.bookeverywhere.site/api/reviews'); 
  //       const data = response.data; // 응답으로 받은 데이터
  //     //   if (data.length !== 0) {
  //     //     const PublicReviewData = data.filter((item: any) => !item.isPrivate)
  //     //     setPublicReviews(PublicReviewData)
  //     //  }
  //       console.log(data)
       
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData(); // 데이터를 가져오는 함수 호출

  //   // if (storedData) {
  //   //   const parsedData = JSON.parse(storedData)
  //   //   const PublicReviewData = parsedData.filter((item: any) => !item.isPrivate)
  //   //   console.log(PublicReviewData)
  //   //   setPublicReviews(PublicReviewData)
  //   // }
  // }, [])


  
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
      <NavBar/>
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
            {session ? (
              <Link
                href="/write"
                className=" bg-[#FFB988] text-white font-bold py-4 px-6 hover:bg-[#AF6C3E] rounded-lg shadow-md hover:shadow-lg"
              >
                독후감 기록하기
              </Link>
            ) : (
              <div
                className=" bg-[#FFB988] text-white font-bold py-4 px-6 hover:bg-[#AF6C3E] rounded-lg shadow-md hover:shadow-lg"
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
          <div className="flex flex-wrap justify-center mb-10 sm:px-40 ">
            {tagInfo.map((tag: any, i: number) => (
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

        <div className="mt-10">
          <div className="text-2xl font-display font-bold py-10">내 서재</div>
          {session.data ? (
            <BookLayout isMain={true}></BookLayout>
          ) : (
            <div>로그인 하고 내 서재 를 확인하세요</div>
          )}
        </div>
        <div className="mt-10">
             <h1 className='text-2xl font-display font-bold py-10'>콘텐츠</h1>
            <div className=''>
            <div className='my-3 w-[60rem] h-[5rem] bg-[#D9D9D9] rounded-lg'>
              <p>오늘 제일 많이 읽은 장소</p>
            </div>
            <div className='my-3 w-[60rem] h-[5rem] bg-[#D9D9D9] rounded-lg'>
              <p>베스트셀러를 읽은 장소</p>
            </div>
            <div className='my-3 w-[60rem] h-[5rem] bg-[#D9D9D9] rounded-lg'>
              <p>오늘 가장 많이 읽은 책</p>
            </div>
                </div>
                </div>
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold py-10">모든 기록</h1>
            <span className='inline-block align-middle'>
              <Link href={'/allreview'}>
                <Image
                  src={moreIcon}
                  alt={'moreIcon'}
                  width={22}
                  height={30}
                />
              </Link>
            </span>
          </div>
          {documents.length === 0 ? (
            <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
              <section className="pt-16">
                <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
                  <h1 className="text-4xl">등록된 리뷰가 없습니다</h1>
                </div>
              </section>
            </div>
          ) : (
          <div className="flex justify-between items-center">
          <div className="p-2 cursor-pointer" onClick={handleClickPrev}>
              &lt;
            </div>
          <div className="grid grid-cols-4 justify-center items-center w-[80rem]">
            {publicReviews
              .slice(startIdx, startIdx + numVisibleBooks)
              .map((d: any, i: number) => (
                <Link
                  key={i}
                  href={`/detail/${d.bookRespDto && d.bookRespDto.isbn ? d.bookRespDto.isbn.replace(' ', '') : ''}`}
                >
                  <div className="flex flex-col items-center rounded-lg border-4 border-transparent p-4 cursor-pointer">
                  <div className="relative w-[14rem] h-[12rem] rounded-2xl">
                   <div className="mx-auto h-full border rounded-2xl shadow-xl bg-[#fcfcfc]">
                     <div className='text-left'>
                     <div className='text-xl font-display font-bold px-5 py-5'>{d.bookRespDto?.title}</div>
                     <div className='px-3'>{d.content.length > 20 ? `${d.content.slice(0, 20)}...` : d.content}</div>
                     </div>
                   </div>
                 </div>
                  </div>
                </Link>
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
          <h1 onClick={scrollToTop} className="cursor-pointer">
            첫 화면으로 올라가기
          </h1>
        </div>
      </div>
    </div>
  )
}
