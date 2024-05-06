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
import profileImage from '/public/images/profileImage.jpg'
import bookIcon from '/public/images/bookIcon.png'
import NotesImg from '/public/images/notesImg.png'
import placeImage from '/public/images/placeImage.jpg';

import { table } from 'console'
import { allReviewDataState } from '@/store/writeAtoms'
import axios from 'axios'
import { GoBackButton } from '@/app/components/buttons/goBackButton'
import CustomModal from '@/app/components/modal'
import ModalContent from '@/app/components/detailModal'
import AvataItemsList from '@/app/components/avatarList'

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
  // console.log(session.data)

  const [myData, setMyData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [myPageData, setMyPageData] = useState([])
  const [smallMap, setSmallMap] = useState(false)
  const [selectedTab, setSelectedTab] = useState('북마크');
  const [isActived, setIsActived] = useState<string | null>(null);
  const [lastSelectedTab, setLastSelectedTab] = useState<string>('')
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followerModalOpen, setFollowerModalOpen] = useState(false);
  const [likeModalOpen, setLikeModalOpen] = useState(false);

  let imageArr: any[] = [placeImage];

  const handleActived = (tabIdx: string) => {
      setSelectedTab(tabIdx);
      setIsActived(isActived === tabIdx ? null : tabIdx);
      setLastSelectedTab(tabIdx);
     
  }


   // 팔로워와 팔로우 모달 열기 함수
   const openFollowModal = () => {
    setFollowModalOpen(true);
  };

  const openFollowerModal = () => {
    setFollowerModalOpen(true);
  };


  const openLikeModal = () => {
    setLikeModalOpen(true);
  };

  // 팔로워와 팔로우 모달 닫기 함수
  const closeFollowModal = () => {
    setFollowModalOpen(false);
  };

  const closeFollowerModal = () => {
    setFollowerModalOpen(false);
  };

  const closeLikeModal = () => {
    setLikeModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.bookeverywhere.site/api/data/all/${props.id}`,{
          withCredentials: true,
        }
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
    <section>
    <div className="">
      <div className='bg-[#F1E5CF]'>
      <div className="grid relative mx-auto justify-center text-center sm:mb-0">
        <Image
          src={lampIcon.src}
          className="inline-block text-center"
          alt={lampIcon.src}
          width={150}
          height={100}
        />
        <div>
        </div>
      </div>
      <div className='bg-white lg:w-[60vw] mx-auto rounded-t-lg'>
        {session.data && (
        <div className='flex items-center justify-center sm:flex-col'>
        <div className='pt-10'>
          <Image 
            src={session.data.user?.image} 
            width={100} height={100} 
            alt="User Thumbnail" className="object-cover rounded-full w-[150px] h-[150px]" />
        </div>
        <div className='lg:ml-10 sm:flex-col justify-center items-center relative top-5 w-[30vw]'>
        <div className='inline-flex gap-20 items-center sm:block'>
          
        <div className='mx-auto font-bold text-lg'>{session.data.user?.name} 님</div>
        <div className='lg:w-[5vw] text-center text-white bg-[#E57C65] p-2 rounded-2xl cursor-pointer'>팔로우</div>
        </div>
        <div className='block mt-5 sm:text-sm'>
          제가 선호하는 장소는 수지구 입니다
        </div>
        <div className='block mt-5 sm:text-sm text-[#D3D3D3] cursor-pointer'>
          프로필 수정
        </div>
        <div className='lg:absolute lg:top-0 lg:right-0'>
        <div className='flex gap-12 cursor-pointer'>
        <div className='flex flex-col items-center' onClick={openFollowModal}>
        <div className='font-bold text-xl'>32</div>
        <div className='sm:text-sm'>팔로우</div>
        </div>
        <div className='flex flex-col items-center' onClick={openFollowerModal}>
        <div className='font-bold text-xl'>16</div>
        <div className='sm:text-sm'>팔로워</div>
        </div>
        <div className='flex flex-col items-center' onClick={openLikeModal}>
        <div className='font-bold text-xl'>3</div>
        <div className='sm:text-sm'>좋아요</div>
        </div>
        </div>
       
        </div>
        </div>
        </div>
        )}
          <div>
      {/* 팔로우 목록 모달 */}
      <CustomModal
        isOpen={followModalOpen}
        onClose={closeFollowModal}
        size={'50rem'}
        modalColor="#ffffff"
        modalheight="80vh"
      >
        {/* 팔로우 목록 컨텐츠 */}
        <div className='p-10'>
          <div>팔로우 목록 콘텐츠</div>
         <AvataItemsList/>
        </div>
      </CustomModal>

      {/* 팔로워 목록 모달 */}
      <CustomModal
        isOpen={followerModalOpen}
        onClose={closeFollowerModal}
        size={'50rem'}
        modalColor="#ffffff"
        modalheight="80vh"
      >
        {/* 팔로워 목록 컨텐츠 */}
        <div className='p-10'>
          <div>팔로워 목록 콘텐츠</div>
          <AvataItemsList/>
        </div>
      </CustomModal>

        {/* 좋아요 목록 모달 */}
        <CustomModal
        isOpen={likeModalOpen}
        onClose={closeLikeModal}
        size={'50rem'}
        modalColor="#ffffff"
        modalheight="80vh"
      >
        {/* 팔로워 목록 컨텐츠 */}
        <div className='p-10'>
          <div>좋아요 목록 콘텐츠</div>
          <AvataItemsList/>
        </div>
      </CustomModal>
    </div>

     
      <div className='relative h-[150px] top-10 flex justify-center items-center border-b rounded-lg shadow-xl'>
      <div className='absolute bottom-0 bg-white w-full gap-2 rounded-xl sm:shadow-none'>
      <div className="absolute bottom-0 grid grid-cols-2 w-full">
        <div className={`text-center cursor-pointer ${isActived === '북마크' ? `border-b-4 border-[#E57C65]` : ''}`} onClick={() => handleActived('북마크')}>
          <div className='w-[13vw] h-[8vh] mx-auto'>
          <div className='font-bold text-2xl'>32</div>
          <div>북마크</div>
          </div>
        </div>
        <div className={`text-center cursor-pointer ${isActived === '게시글' ? `border-b-4 border-[#E57C65]` : ''}`} onClick={() => handleActived('게시글')}>
        <div className="w-[13vw] h-[8vh] mx-auto">
          <div className='font-bold text-2xl'>32</div>
          <div>게시글</div>
        </div>
        </div>
          </div>
          </div>
          </div>
      </div>
      </div>
      </div>

     
        <div>
           {selectedTab === '북마크' && (
              <div className="relative w-[60vw] mx-auto mt-20">
              <div className='py-10 sm:py-6 p-5 mb-3 sm:p-0'>
                <div className="text-xl sm:text-xl font-display font-bold">북마크 목록</div>
                <div className='grid grid-cols-3 gap-2 mt-5'>
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-[25vh] rounded-10 relative">
                      <img src={placeImage.src} className='object-cover w-full h-full rounded-10' alt={`Bookmark ${index}`} />
                      <div className='absolute bottom-3 mx-3 text-white leading-3'>
                        <div className='font-bold text-sm'>수지구청역 스타벅스</div>
                        <div className='text-xs'>용인, 수지구 카페</div>
                      </div>
                    </div>
                  ))}
                </div>            
              </div>
            </div>
           )}
           {selectedTab === '게시글' && (
             <div className="relative w-[60vw] mx-auto mt-20">
             <div className='py-10 sm:py-6 p-5 mb-3 sm:p-0'>
               <div className="text-xl sm:text-xl font-display font-bold">게시글</div>
               <div className='grid grid-cols-3 gap-2 mt-5'>
                 {[...Array(6)].map((_, index) => (
                   <div key={index} className="h-[25vh] rounded-10 relative">
                     <img src={placeImage.src} className='object-cover w-full h-full rounded-10' alt={`Bookmark ${index}`} />
                     <div className='absolute bottom-3 mx-3 text-white leading-3'>
                       <div className='font-bold text-sm'>수지구청역 스타벅스</div>
                       <div className='text-xs'>용인, 수지구 카페</div>
                     </div>
                   </div>
                 ))}
               </div>            
             </div>
           </div>
           )}
               <div className ='bg-white relative w-[60vw] mx-auto'>
               <div className="mt-20 sm:px-5">
                   <div className='py-10 sm:py-6 p-5 mb-3 sm:p-0 border rounded-lg relative sm:shadow-none'>
                     <div className="text-xl sm:text-xl font-display font-bold">최근 방문 기록</div>
                       <div className='flex mt-5 gap-2'>
                       <div className="w-[20vw] h-[25vh] rounded-10">
                         <div className='relative'>
                         <img src={placeImage.src} className='object-cover w-[25vw] h-[25vh]'/>
                         <div className='absolute bottom-3 mx-3 text-white leading-3'>
                         <div className='font-bold text-sm'>수지구청역 스타벅스</div>
                           <div className='text-xs'>용인, 수지구 카페</div>
                         </div>
                       </div>
                       </div>
                     </div>            
                   </div>
                   </div>
         
                   <div className="mt-20 sm:px-5">
                   <div className='py-10 sm:py-6 p-5 mb-3 sm:p-0 border rounded-lg relative sm:shadow-none'>
                     <div className='flex gap-2 pb-[3%]'>
                     <div className="text-xl sm:text-xl font-display font-bold">내 지도</div>
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
                       <div className='flex mt-10 gap-2'>
                       <div className="w-[25vw] h-[25vh] rounded-10">
                       {!smallMap ? (
                     // <MapView
                     //   myMapData={myPageData}
                     //   isShared={true}
                     //   isFull={`400px`}
                     //   isMain={true}
                     //   markerImage={props.markerImage}
                     // ></MapView>
                     <div>
                     <div id="map" style={{ display: 'none' }}></div>
                     <div>독서 기록을 남기고 지도를 확인하세요</div>
                   </div>
                   ) : (
                     <div>
                       <div id="map" style={{ display: 'none' }}></div>
                       <div>독서 기록을 남기고 지도를 확인하세요</div>
                     </div>
                   )}
                       </div>
                     </div>            
                   </div>
                   </div>
               </div>
         
        </div>
    
        
       
       
    
      
      </section>
  )
}

export default MyPageComponent
