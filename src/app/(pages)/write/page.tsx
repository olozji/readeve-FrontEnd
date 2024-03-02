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
import isPrivatedIcon from '/public/images/isPrivatedIcon.png';
import isSharededIcon from '/public/images/isSharedIcon.png';


const Editor = () => {
  const [content, setContent] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('')
  const [InputText, setInputText] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [isPrivatePlace, setIsPrivatePlace] = useState(true)
  const [titleInfo, setTitleInfo] = useRecoilState<string>(titleState)
  const [bookInfo] = useRecoilState<any>(bookState)
  const [tagInfo, setTagInfo] = useRecoilState<any>(tagState)
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeState)
  const [allDataInfo, setAllDataInfo] = useRecoilState<any>(allDataState)
  const [showTagModal, setShowTagModal] = useState(false)

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
    console.log(isPrivatePlace)
    if (inputRef.current) {
      inputRef.current.focus() // Input에 focus() 호출
    }
  }, [isPrivatePlace])

  const numTag = tagInfo.slice(0, 3)
  const inputRef = useRef<HTMLInputElement | null>(null)

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
    console.log(titleInfo)
  }

  const handleIsPrivateClick = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate)
  }

  const handlePublicClick = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate)
  }

  const handleTagClick = (index: number) => {
    if (index >= 0 && index < tagInfo.length) {
      // 객체를 복사하여 새로운 객체를 생성
      const updatedTags = tagInfo.map((tag: any, i: number) =>
        i === index ? { ...tag, isSelected: !tag.isSelected } : tag,
      )

      // Recoil 상태를 갱신
      setTagInfo(updatedTags)
    }
  }

  const handleAllData = async (e: any) => {
    e.preventDefault()
    let data = {
      socialId: session.data.user!.id,
      title: titleInfo,
      isPrivate: isPrivate,
      writer: session.data.user!.name,
      pinRespDto: {
        name: placeInfo.place_name,
        placeId: placeInfo.id,
        y: placeInfo.y,
        x: placeInfo.x,
        address: placeInfo.road_address_name,
        isPrivate: isPrivatePlace,
        url: placeInfo.place_url,
      },
      bookRespDto: {
        isbn: bookInfo.isbn,
        title: bookInfo.title,
        thumbnail: bookInfo.thumbnail,
        isComplete: bookInfo.isComplete,
        // author:bookInfo.authors[0],
      },
      tags: tagInfo,
      content: content,
    }

    const postData = async () => {
      try {
        const response = await axios.post(
          'https://api.bookeverywhere.site/api/write',
          data,
        )
        // console.log(data)
        console.log('Success:', response.data)
      } catch (error) {
        console.log(data)
        console.error('Error:', error)
      }
    }

    postData()

    // const url =
    //   'http://ec2-54-180-159-247.ap-northeast-2.compute.amazonaws.com/map'

    // // GET 요청 보내기
    // try {
    //   const response = await axios.get(url);
    //   console.log('응답 데이터:', response.data);
    // } catch (error) {
    //   console.error('에러 발생:', error);
    // }
    const storedData = localStorage.getItem('allDataInfo')
    const previousData = storedData ? JSON.parse(storedData) : []

    // 새로운 데이터 추가
    const newData = [...previousData, data]

    // // 로컬 스토리지에 저장
    localStorage.setItem('allDataInfo', JSON.stringify(newData))
    // setAllDataInfo({})
    // setTitleInfo('')
    // setPlaceInfo({})
    // setTagInfo([{content:'잔잔한 음악이 흘러요',selected:false},{content:'날씨 좋은날 테라스가 좋아요',selected:false},{content:'카공하기 좋아요',selected:false},{content:'힙합BGM이 흘러나와요',selected:false},{content:'조용해서 좋아요',selected:false},{content:'한적해요',selected:false},{content:'자리가 많아요',selected:false},{content:'차마시기 좋아요',selected:false},{content:'귀여운 고양이가 있어요🐈',selected:false},{content:'책을 무료로 대여해줘요📚',selected:false}])
    // Router 인스턴스 가져오기

    // 페이지 리다이렉트
    // window.location.href = `/mypage/${session.data?.user.id}` // 이동할 경로
    // console.log(allDataInfo)
  }

  return (
    <>
      <NavBar />
      <div className="bg-[#F1E5CF] flex justify-center mx-auto box-border min-h-full">
        <div className="sm:pt-10 md:pt-20 xl:pt-20">
          <header className="h-10 text-center">
            <h1 className="myCustomText text-3xl text-white">독후감 작성</h1>
          </header>

          <section className='py-10 px-10'>
          <div className="px-5 py-8 flex rounded-t-md">
            <div className="flex max-w-[70rem] px-3">
              <input
                placeholder='제목'
                ref={inputRef}
                className="inline-block w-[60rem] h-[2.8rem] px-3 border-2 shadow-md rounded-md bg-[#FEF6E6]"
                value={titleInfo}
                onChange={handleTitle}
              />
            </div>
          </div>
          <div className="px-8 py-3 flex gap-5 items-center">
            <h4 className="px-5 font-extrabold">장소</h4>
            <div>
              <input
                placeholder='독서한 장소를 입력해주세요'
                ref={inputRef}
                className="inline-block w-[35rem] h-[2rem] px-3 border-2 shadow-md rounded-2xl bg-[#FEF6E6]"
                value={placeInfo.place_name}
                onClick={handleSearchMap}
              />
              {showMap && (

                <CustomModal isOpen={true} modalheight={'85vh'} size={'100vh'} onClose={handleCloseMap}>

                    <AddPlace
                      onClose={handleCloseMap}
                      onMarkerClickParent={setSelectedPlace}
                      selectedPlace={selectedPlace}
                    />
                    <div className="py-3 px-16">
                      <label className="inline-flex gap-3 items-center cursor-pointer">
                        <span className="ms-3 text-[#828282] text-sm font-medium">
                          나만보기
                        </span>
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          onClick={() => {
                            setIsPrivate(!isPrivate)
                          }}
                          checked={isPrivate}
                        />
                        <div className="relative w-11 h-6 bg-[#D1D1D1] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E57C65]"></div>
                      </label>
                      <p className="py-3 px-3 text-sm text-[#979797]">
                        나만보기를 선택할 경우, 다른 사람들이 회원님의 장소를
                        확인할 수 없습니다
                      </p>
                      <div className="flex mx-auto w-[8rem]">
                        <Button
                          label="확인"
                          outline={true}
                          onClick={() => handleConfirmation(true)}
                        />
                      </div>
                    </div>
                  </CustomModal>
                )}
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
                className="cursor-pointer text-[#7a7a7a] font-light text-4xl"
              >
                +
              </button>
            </div>
            <CustomModal
              isOpen={showTagModal}
              onClose={() => setShowTagModal(false)}
              size={'60rem'}
              modalheight={'40rem'}
            >
              <div className="mt-10 px-10 py-10 text-center">
                <div className="border-b-[2px]">
                  <h1 className="font-bold text-2xl text-left py-3 border-b-[2px]">
                    장소와 딱맞는 태그를 선택해 주세요
                  </h1>
                  <div className="flex flex-wrap justify-center my-10 sm:px-20 ">
                  {tagInfo.map((tag: any, i: number) => (
                    <div className="flex">
                      
                        <div
                          key={i}
                          className={`box-border flex justify-center items-center px-4 py-2
                 my-2 mx-2 border border-gray-300 rounded-full 
                 ${
                   tag.isSelected
                     ? 'bg-[#E57C65] text-white'
                     : 'bg-white hover:border-[#C05555] hover:text-[#C05555]'
                 }`}
                          onClick={() => handleTagClick(i)}
                        >
                          #{tag.content}
                        </div>
                     
                    </div>
                  ))}
                    </div>
                </div>
              </div>
              <div className="flex mx-auto w-[8rem]">
                <Button
                  label="확인"
                  outline={true}
                  onClick={() => {
                    setShowTagModal(false)
                  }}
                />
              </div>
        </CustomModal>
        <div className="py-8 flex gap-4 justify-center items-center">
        <span
        className={`inline-flex justify-center items-center gap-2 rounded-lg px-3 py-3 text-xs font-medium ${
          isPrivate ? 'bg-[#E57C65] text-white'  : 'bg-white text-black'
        }`}
        onClick={handleIsPrivateClick}
      >
       <Image
         src={isPrivatedIcon}
         alt='isPrivatedIcon'
         width={13}
         height={13}
       />
        나만보기
        </span>
        <span
        className={`inline-flex items-center rounded-lg gap-2 px-3 py-3 text-xs font-medium ${
          !isPrivate ? 'bg-[#E57C65] text-white'  : 'bg-white text-black'
        }`}
        onClick={handlePublicClick}
        >
       <Image
         src={isSharededIcon}
         alt='isSharededIcon'
         width={13}
         height={13}
       />
        전체공개
        </span>
        </div>


            <div className="py-8 border-white border-t-2">
              <div className="px-5 py-8">
                <div className="flex gap-2 pb-5">
                  <Image src={pen} alt="pen" width={30} height={30} />
                  <h1 className="font-extrabold text-xl">작성</h1>
                </div>
               
              </div>

              <textarea
                className="border border-slate-200 rounded-2xl w-full h-80 bg-[#FEF6E6] px-3 py-3"
                placeholder="(1500자 이내로 독후감을 작성해주세요)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

            </div>
            <div>
              <div className="control_btn flex mx-auto w-[18rem] gap-5">
                <Button label="삭제하기" outline={false} />
                <Button
                  label="저장하기"
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
