'use client'

import NavBar from '@/app/components/NavBar'
import { BookSearch } from '@/app/components/bookSearch'
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
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

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
  let session: any = useSession()

  let user: any = session.data?.user

  useEffect(() => {
    console.log(isPrivatePlace)
  }, [isPrivatePlace])
  const handleSearchMap = useCallback((e: any) => {
    e.preventDefault()
    setShowMap(true)
  }, [])

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
  }

  const handleAllData = async (e: any) => {
    e.preventDefault()
    let data = {
      socialId:session.data.user.id,
      title: String(titleInfo),
      isPrivate: isPrivate,
      writer:session.data.user.name,
      pinRespDto: {
        content: placeInfo.place_name,
        placeId: placeInfo.id,
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
  //   let sample={
  //     "socialId" : 3345007591,
  //     "title": "titleInfo",
  //     "writer": "이름",
  //     "isPrivate": true,
  //     "pinRespDto": {
  //         "name": "placeInfo.place_name",
  //         "placeId" : 118,
  //         "y": 488532.02,
  //         "x": 100809.02,
  //         "address": "placeInfo.road_address_name",
  //         "isPrivate": false,
  //         "url" : "Stirngksladja"
  //     },
  //     "bookRespDto": {
  //         "isbn":"bookInfo.isb32n",
  //         "title": "bookInfo.title",
  //         "thumbnail": "bookInfo.thumbnail",
  //         "isComplete": false
  //     },
  //     "tags":[ 
  //         {
  //             "content" : "tag0",
  //             "isSelected" : false
  //         },
  //         {
  //             "content" : "tag1",
  //             "isSelected" : true
  //         },
  //         {
  //             "content" : "tag2",
  //             "isSelected" : true
  //         }
  //         ]
  //     ,
  //     "content":"conte2323t"
  
  // }
    try {
      const response = await axios.post('https://api.bookeverywhere.site/api/write',data);
      console.log(data)
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    
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
    // const storedData = localStorage.getItem('allDataInfo')
    // const previousData = storedData ? JSON.parse(storedData) : []

    // // 새로운 데이터 추가
    // const newData = [...previousData, data]

    // // 로컬 스토리지에 저장
    // localStorage.setItem('allDataInfo', JSON.stringify(newData))
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
      <div className="flex justify-center mx-auto box-border min-h-full">
        <div className="w-full px-5 py-10 sm:px-10 md:px-20 lg:px-40 xl:px-80 border border-slate-400 rounded-md">
          <header className="h-10">
            <h1>기록하기</h1>
          </header>
          <section className="py-8 flex gap-10 border border-slate-400 rounded-t-md">
            <h4 className="px-5">제목</h4>
            <div className="flex">
              <input
                className="border-slate-400 rounded-md bg-slate-200"
                value={titleInfo}
                onChange={handleTitle}
              />
              <div className="ml-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    onClick={() => {
                      setIsPrivate(!isPrivate)
                    }}
                    checked={isPrivate}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium">나만보기</span>
                </label>
              </div>
            </div>
          </section>
          <section className="py-8 flex gap-10 border border-slate-400">
            <h4 className="px-5">where</h4>
            <div className="input_box ">
              <input
                className="border-slate-400 rounded-md bg-slate-200"
                value={placeInfo.place_name}
                onClick={handleSearchMap}
              />
              {showMap && (
                <CustomModal isOpen={true} modalheight={'85vh'} size={'45rem'} onClose={handleCloseMap}>
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
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onClick={() => {
                    setIsPrivatePlace(!isPrivatePlace)
                  }}
                  checked={isPrivatePlace}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium">나만의 장소</span>
              </label>
            </div>
          </section>
          <section className="py-8 flex gap-10 border border-slate-400">
            <h4 className="px-5">Book</h4>
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
                  <div className="p-4">{bookInfo.title}</div>
                </div>
              )}
              <BookSearch></BookSearch>
            </div>
          </section>
          <section className="py-8 flex border border-slate-400 ">
            <h4 className="px-5">tag</h4>

            <Tag></Tag>
          </section>

          <section className="py-8 border border-t-0 border-slate-400 rounded-b-md">
            <div className="px-5 py-8">
              <div>내용</div>
              <textarea
                className="border border-slate-200 rounded-md w-full h-80 bg-slate-200"
                placeholder="오늘 나의 독서는..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </section>
          <section>
            <div className="control_btn flex gap-5">
              <button className="bg-red-300 rounded-md">취소하기</button>
              <button
                className="bg-indigo-400 rounded-md"
                onClick={handleAllData}
              >
                작성완료
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Editor
