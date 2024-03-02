'use client'

import NavBar from '@/app/components/NavBar'
import { BookSearch } from '@/app/components/bookSearch'
import Button from '@/app/components/buttons/button'
import AddPlace from '@/app/components/map'
import CustomModal from '@/app/components/modal'
import { Tag } from '@/app/components/tags'
import {
  allDataState,
  bookState,
  placeState,
  tagState,
  titleState,
} from '@/store/writeAtoms'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

import Image from 'next/image'
import pen from 'public/images/Pen.png';
import isPrivated from '/public/images/isPrivated.png';
import isShareded from '/public/images/isShareded.png';

const Editor = () => {
  const [content, setContent] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('')
  const [InputText, setInputText] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [isPrivatePlace, setIsPrivatePlace] = useState(true)
  const [titleInfo, setTitleInfo] = useRecoilState(titleState)
  const [bookInfo] = useRecoilState<any>(bookState)
  const [tagInfo,setTagInfo] = useRecoilState<any>(tagState)
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeState)
  const [allDataInfo, setAllDataInfo] = useRecoilState<any>(allDataState)
  const [showTagModal, setShowTagModal] = useState(false);
  
  
  let session: any = useSession()

  let user: any = session.data?.user

  useEffect(() => {
    console.log(isPrivatePlace)
  }, [isPrivatePlace])
  const handleSearchMap = useCallback((e: any) => {
    e.preventDefault()
    setShowMap(true)
  }, [])

  useEffect(() => {
    console.log(isPrivatePlace);
    if (inputRef.current) {
      inputRef.current.focus(); // Input에 focus() 호출
    }
  }, [isPrivatePlace]);

  const numTag = tagInfo.slice(0,3);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCloseMap = useCallback(() => {
    setShowMap(false)
    setPlaceInfo({})
  }, [])

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      setSelectedPlace(selectedPlace)
      setInputText(selectedPlace)
      onMarkerClickParent(selectedPlace)
      console.log('사용자가 선택한 장소:', selectedPlace)
      setShowMap(false)
    } else {
      handleCloseMap()
    }
  }

  const onMarkerClickParent = (markerInfo: string) => {
    setInputText(markerInfo)
  }
  const handleTitle = (e: any) => {
    e.preventDefault()
    setTitleInfo(e.target.value)
    console.log(titleInfo);
  }

  const handleIsPrivateClick = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);
  };

  const handlePublicClick = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);
  };



  const handleTagClick = (index: number) => {
    if (index >= 0 && index < tagInfo.length) {
      // 객체를 복사하여 새로운 객체를 생성
      const updatedTags = tagInfo.map((tag:any, i:number) =>
        i === index ? { ...tag, selected: !tag.selected } : tag
      );
  
      // Recoil 상태를 갱신
      setTagInfo(updatedTags);
    }
  };

  const handleAllData = async (e: any) => {
    e.preventDefault()
    let data = {
      title: titleInfo,
      isPrivate: isPrivate,
      writer:session.data.user.name,
      place: {
        place_name: placeInfo.place_name,
        id: placeInfo.id,
        y: placeInfo.y,
        x: placeInfo.x,
        address: placeInfo.road_address_name,
        isPrivate: isPrivatePlace,
        url: placeInfo.place_url,
      },
      book: {
        isbn: bookInfo.isbn,
        title: bookInfo.title,
        thumbnail: bookInfo.thumbnail,
        isComplete: bookInfo.isComplete,
        author:bookInfo.authors[0],
      },
      tags: tagInfo,
      content: content,
    }
    // try {
    //   const response = await axios.post('http://ec2-54-180-159-247.ap-northeast-2.compute.amazonaws.com/api/write', data);
    //   console.log('Success:', response.data);
    // } catch (error) {
    //   console.error('Error:', error);
    // }
    
    // const url =
    //   'http://ec2-54-180-159-247.ap-northeast-2.compute.amazonaws.com/map'

    // // GET 요청 보내기
    // try {
    //   const response = await axios.get(url);
    //   console.log('응답 데이터:', response.data);
    // } catch (error) {
    //   console.error('에러 발생:', error);
    // }
    // 이전 데이터 가져오기
    const storedData = localStorage.getItem('allDataInfo')
    const previousData = storedData ? JSON.parse(storedData) : []

    // 새로운 데이터 추가
    const newData = [...previousData, data]

    // 로컬 스토리지에 저장
    localStorage.setItem('allDataInfo', JSON.stringify(newData))
    setAllDataInfo({})
    setTitleInfo('')
    setPlaceInfo({})
    setTagInfo([{name:'잔잔한 음악이 흘러요',selected:false},{name:'날씨 좋은날 테라스가 좋아요',selected:false},{name:'카공하기 좋아요',selected:false},{name:'힙합BGM이 흘러나와요',selected:false},{name:'조용해서 좋아요',selected:false},{name:'한적해요',selected:false},{name:'자리가 많아요',selected:false},{name:'차마시기 좋아요',selected:false},{name:'귀여운 고양이가 있어요🐈',selected:false},{name:'책을 무료로 대여해줘요📚',selected:false}])
    // Router 인스턴스 가져오기

    // 페이지 리다이렉트
    window.location.href = `/mypage/${session.data?.user.id}` // 이동할 경로
    console.log(allDataInfo)
  }


  return (
    <>
      <NavBar />
      <div className="bg-[#F1E5CF] flex justify-center mx-auto box-border min-h-full">
        <div className="w-full px-10 py-20 sm:px-10 md:px-20 lg:px-40 xl:px-80 border border-slate-400 rounded-md">
          <header className="h-10 text-center">
            <h1 className='myCustomText text-3xl text-white'>독후감 작성</h1>
          </header>
          <section className='py-10 px-10'>
          <div className="px-5 py-8 flex rounded-t-md">
            <div className="flex w-[70rem] max-w-[70rem] px-3">
              <input
                placeholder='제목'
                ref={inputRef}
                className="inline-block w-[60rem] h-[2.8rem] px-3 border-2 shadow-md rounded-md bg-white"
                value={titleInfo}
                onChange={handleTitle}
              />
            </div>
          </div>
          <div className="px-8 py-3 flex gap-5 items-center">
            <h4 className="px-5 font-extrabold">장소</h4>
            <div className="input_box">
              <input
                placeholder='독서한 장소를 입력해주세요'
                ref={inputRef}
                className="inline-block w-[35rem] h-[2rem] px-3 border-2 shadow-md rounded-2xl bg-white"
                value={placeInfo.place_name}
                onClick={handleSearchMap}
              />
              {showMap && (
                <CustomModal isOpen={true} modalheight={'60rem'} size={'45rem'} onClose={handleCloseMap}>
                  <AddPlace
                    onClose={handleCloseMap}
                    onMarkerClickParent={setSelectedPlace}
                    selectedPlace={selectedPlace}
                  />
                  <div className="mt-4 text-center">
                    <p>선택된 장소: {placeInfo.place_name}</p>
                    <p>선택된 장소가 맞습니까?</p>
                    <button
                      onClick={() => handleConfirmation(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      예
                    </button>
                    <button
                      onClick={() => handleConfirmation(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      아니오
                    </button>
                  </div>
                </CustomModal>
              )}
            </div>
            <div>
            </div>
          </div>
          <div className="px-8 py-3 flex gap-5 items-center">
            <h4 className="px-5 font-extrabold">도서</h4>
            <div>
              {bookInfo.title && (
                <div
                  className="justify-items-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div>현재 선택된 책</div>
                  <img
                    src={
                      bookInfo.thumbnail
                        ? bookInfo.thumbnail
                        : 'http://via.placeholder.com/120X150'
                    }
                    alt="책 표지"
                    className="mb-2 rounded"
                  />
                  <div className="input_box">{bookInfo.title}</div>
                </div>
              )}
              <BookSearch></BookSearch>
            </div>
          </div>
          <div className="px-8 py-3 flex items-center">
            <h4 className="px-5 font-extrabold">장소 태그</h4>
            <Tag tags={numTag}></Tag>
            <button 
              onClick={() => setShowTagModal(true)}
              className='cursor-pointer text-[#7a7a7a] font-light text-4xl'>+</button>
          </div>
          <CustomModal isOpen={showTagModal} onClose={() => setShowTagModal(false)} size={'60rem'} modalheight={'40rem'}>
          <div className="mt-10 px-10 py-10 text-center">
            <div className='border-b-[2px]'>
              <h1 className='font-bold text-2xl text-left py-3 border-b-[2px]'>
              장소와 딱맞는 태그를 선택해 주세요
                </h1>
            {tagInfo.map((tag:any, i:number) => (
              <div className='inline-block px-5 py-5'>
              <div className=''>
              <div
                key={i}
                className={`box-border flex justify-center items-center px-4 py-2
                 my-2 mx-2 border border-gray-300 rounded-full w-[10rem]
                 ${tag.selected ? 'bg-[#E57C65] text-white' :
                  'bg-white hover:border-[#C05555] hover:text-[#C05555]'}`}
                onClick={() => handleTagClick(i)}
              >
                #{tag.name}
              </div>
             
              </div>
              </div>
            ))}
          </div>
          </div>
          <div className='flex mx-auto w-[8rem]'>
          <Button 
              label='확인'
              outline={true}
            />
            </div>
        </CustomModal>
        <div className="py-8 flex gap-4 justify-center">
        <span
        className={`inline-flex items-center rounded-lg px-3 py-3 text-xs font-medium ${
          isPrivate ? 'bg-[#E57C65] text-white'  : 'bg-white text-black'
        }`}
        onClick={handleIsPrivateClick}
      >
       {/* <Image
         src={isPrivated}
         alt='pen'
         style={{ width: '12px', height: '12px' }}
       />
        나만보기 */}
        나만보기
        </span>
        <span
        className={`inline-flex items-center rounded-lg px-3 py-3 text-xs font-medium ${
          !isPrivate ? 'bg-[#E57C65] text-white'  : 'bg-white text-black'
        }`}
        onClick={handlePublicClick}
      >
       {/* <Image
         src={isPrivated}
         alt='pen'
         width={10}
         height={10}
       /> */}
        전체공개
        </span>
        </div>

          <div className="py-8 border-white border-t-2">
            <div className="px-5 py-8">
              <div className='flex gap-2 pb-5'>
              <Image
                src={pen}
                alt='pen'
                width={30}
                height={30}
              />
              <h1 className='font-extrabold text-xl'>작성</h1>  
              </div>
              <textarea
                className="border border-slate-200 rounded-2xl w-full h-80 bg-white px-3 py-3"
                placeholder="(1500자 이내로 독후감을 작성해주세요)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="control_btn flex mx-auto w-[18rem] gap-5">
              <Button 
                label='삭제하기'
                outline={false}
              />
              <Button 
                label='저장하기'
                outline={true}
                onClick={handleAllData}
              />
            </div>
          </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Editor
