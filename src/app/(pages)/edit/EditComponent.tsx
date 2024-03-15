'use client'

import NavBar from '@/app/components/NavBar'
import { BookSearch } from '@/app/components/bookSearch'
import Button from '@/app/components/buttons/button'
import AddPlace from '@/app/components/map'
import CustomModal from '@/app/components/modal'
import { Tag } from '@/app/components/tags'
import {
  allDataState,
  allReviewDataState,
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

import pen from 'public/images/Pen.png'
import isPrivatedIcon from '/public/images/isPrivatedIcon.png'
import isSharededIcon from '/public/images/isSharedIcon.png'
import LoadingScreen from '@/app/components/loadingScreen'
import CustomAlert from '@/app/components/alert'
export interface PropType {
  editReviewId: number
}
const Editor = ({ editReviewId }: PropType) => {
  const [content, setContent] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('')
  const [editDefault, setEditDefault] = useState<any>({})
  const [editedReview, setEditedReview] = useState<any>(null)
  const [InputText, setInputText] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [isPrivatePlace, setIsPrivatePlace] = useState(true)
  const [tagCategory] = useState(['분위기', '서비스/모임', '시설/기타'])
  const [showAlert, setShowAlert] = useState(false)
  const [showQAlert, setShowQAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [tagData, setTagData] = useState<any>([])
  const [selectedTag, setSelectedTag] = useState<string[]>([])
  const [allDeselect, setAllDeselect] = useState(false)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewPlace, setReviewPlace] = useState<any>({})
  const [reviewBook, setReviewBook] = useState<any>({})
  const [titleInfo, setTitleInfo] = useRecoilState<string>(titleState)
  const [bookInfo, setBookInfo] = useRecoilState<any>(bookState)
  const [tagInfo, setTagInfo] = useRecoilState<any>(tagState)
  const [placeInfo, setPlaceInfo] = useRecoilState<any>(placeState)
  const [allDataInfo, setAllDataInfo] = useRecoilState<any>(allDataState)
  const [showTagModal, setShowTagModal] = useState(false)
  const [allReviewData, setAllReviewData] =
    useRecoilState<any>(allReviewDataState)
  let session: any = useSession()

  const fetchData = async () => {
    if (session.data.user.id) {
      try {
        const response = await axios.get(
          `https://api.bookeverywhere.site/api/data/all/${session.data.user.id}`,
        )
        const data = response.data.data
        console.log(`유저의 모든 데이터;${data}`)
        console.log('게시글 id' + editReviewId)
        console.log('첫번째게시글 리뷰아이디'+data[0].reviewId,isNaN(data.reviewId))
        const editArticle = data.find((d: any) => d.reviewId == editReviewId)
        // TODO:recoil상태를 비동기로 업데이트 할 수 없어서 selector 이용해서 비동기 요청 보내거나
        // EditComponent 에서는 원래 게시글 데이터를 useState로 저장해서 보여주고 바뀌는 부분만 post 요청 보내는 방식으로 구현해야 할 거 같아요
        setEditDefault(editArticle)
        console.log(`수정할 리뷰:${editArticle}`)
        if (editArticle) {
          setTitleInfo(editArticle.title)
          setPlaceInfo(editArticle.pinRespDto)
          setBookInfo(editArticle.bookRespDto)
          setContent(editArticle.content)
          setTagInfo(editArticle.tags)
        } else {
          console.error('Review not found:', editReviewId);
        }
       
        // updateRecoilState(data);

        
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }
  // const updateRecoilState = (data: any) => {

  //   console.log(`수정할 리뷰 함수 안:${editArticle}`);

  //   // Recoil 상태를 설정하기 위한 함수를 정의합니다.
  //   setTitleInfo(editArticle.title);
  //   setPlaceInfo(editArticle.pinRespDto);
  //   setBookInfo(editArticle.bookRespDto);
  //   setContent(editArticle.content);
  //   setTagInfo(editArticle.tags);
  //   console.log(`함수 내부 장소:${placeInfo}`)
  // };
  let user: any = session.data?.user

  const handleSearchMap = useCallback((e: any) => {
    e.preventDefault()
    setShowMap(true)
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus() // Input에 focus() 호출
    }
  }, [isPrivatePlace])

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

  const handleIsPrivateClick = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate)
  }

  const handlePublicClick = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate)
  }

  const handleTagClick = (content: string) => {
    setAllDeselect(false)
    if (!selectedTag.includes(content)) {
      if (selectedTag.length < 5) {
        const insertTag = [...selectedTag, content]
        setSelectedTag(insertTag)
      }
    } else {
      let deleted = selectedTag.filter((tag: string) => tag !== content)
      setSelectedTag(deleted)
    }
  }
  const handleAllDeselect = () => {
    setAllDeselect(true)
    setSelectedTag([])
  }
  const handleContent = (e: any) => {
    e.preventDefault()
    setContent(e.target.value)
    console.log(content)
  }
  const handleQAlert = () => {
    setAlertMessage('등록하시겠습니까?')
    setShowQAlert(true)
  }

  const handleAllData = async () => {
    // e.preventDefault()
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
        author: bookInfo.authors ? bookInfo.authors[0] : null,
      },
      tags: selectedTag,
      content: content,
    }

    const postData = async () => {
      try {
        const response = await axios.post(
          `https://api.bookeverywhere.site/api/write/${editedReview.reviewId}`,
          data,
        )
        console.log(data)
        console.log('Success:', response.data)
        setAllDataInfo({})
        setTitleInfo('')
        setPlaceInfo({})
        window.location.href = `/mypage/${session.data?.user.id}`
      } catch (error) {
        console.log(data)
        console.log(showAlert)
        if (titleInfo === '') {
          setAlertMessage('제목을 입력해주세요!')
        } else if (Object.keys(placeInfo).length === 0) {
          setAlertMessage('장소를 등록해주세요!')
        } else if (Object.keys(bookInfo).length === 0) {
          setAlertMessage('책을 등록해주세요!')
          // TODO:독후감 내용이 없을 때 안 올라가야대는데 올라가네요 ㅜㅜ 로컬환경에서는 작동하는데 배포환경에서는 작동 안 해요 ㅜ
          //TODO: 배포된 환경에서 안올라가야 하는데 올라간다는 부분 수정해보았는데 잘 동작할지는 모르겠어요..!ㅜㅜ
        } else if (content.trim() === '') {
          setAlertMessage('내용을 등록해주세요!')
        } else if (content.length > 1500) {
          setAlertMessage('내용이 1500자 이상입니다!')
        }
        setShowAlert(true)
        // console.error('Error:', error)
        console.log(showAlert)
      }
    }
    postData()
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }
  const handleCloseQAlert = () => {
    setShowQAlert(false)
  }

  // useEffect(() => {
  //   if (tagInfo.length <= 10) {
  //     fetchTag()
  //   }
  // }, [])
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setTagData(tagInfo)
  }, [tagInfo])

  // useEffect(() => {
  //   console.log('장소' + placeInfo)
  //   // setReviewTitle(editDefault.title)
  //   // setReviewPlace(editDefault.pinRespDto)
  //   // setReviewBook(editDefault.bookRespDto)
  //   // setContent(editDefault.content)
  //   // setTagInfo(editDefault.tags)
  // }, [editDefault])

  return (
    <>
      <div className="bg-[#FAF2E5] flex justify-center box-border min-h-full">
        <div className="pt-20 sm:pt-10  ">
          <header className="h-10 text-center">
            <h1 className="myCustomText text-3xl text-black">독후감 작성</h1>
          </header>
          {showAlert && (
            <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
          )}
          {showQAlert && (
            <CustomAlert
              message={alertMessage}
              onClose={handleCloseQAlert}
              isActive={true}
              active={handleAllData}
            />
          )}
          <section className="py-10 px-10 sm:py-0 sm:mx-0">
            <div className="px-5 sm:px-0 sm:py-4 py-8 flex rounded-t-md  ">
              <div className="flex px-3 max-w-[60vw] sm:max-w-full sm:px-0 ">
                <input
                  placeholder="제목"
                  ref={inputRef}
                  className="inline-block  w-[60rem] sm:w-[72vw] h-[2.8rem] text-base px-3 rounded-md bg-[#F9F9F9] placeholder-[#A08A7E]"
                  value={titleInfo !== '' ? titleInfo : reviewTitle}
                  onChange={handleTitle}
                />
              </div>
            </div>
            <div className="px-8 py-3 flex gap-5 items-center sm:px-2">
              <h4 className="px-5 font-extrabold sm:px-0 sm:text-xs">장소</h4>
              <div className="flex px-3 max-w-[60vw] sm:px-0 ">
                <input
                  placeholder="독서한 장소를 입력해주세요"
                  ref={inputRef}
                  className="inline-block w-[35rem] h-[2rem] text-xs/[10px]  px-3 rounded-2xl bg-[#F9F9F9] placeholder-[#A08A7E]"
                  value={placeInfo ? placeInfo.place_name : ''}
                  onClick={handleSearchMap}
                />
                {showMap && (
                  <CustomModal
                    isOpen={true}
                    modalheight={'85vh'}
                    size={'100vh'}
                    onClose={handleCloseMap}
                    modalColor="#fff"
                  >
                    <AddPlace
                      onClose={handleCloseMap}
                      onMarkerClickParent={setSelectedPlace}
                      selectedPlace={selectedPlace}
                    />
                    <div className="py-3 px-16 sm:p-2">
                      <label className="inline-flex gap-3 items-center cursor-pointer  ">
                        <span className="ms-3 text-[#828282] text-sm font-medium">
                          나만의 장소
                        </span>
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          onClick={() => {
                            setIsPrivatePlace(!isPrivatePlace)
                            console.log(isPrivatePlace)
                          }}
                          checked={isPrivatePlace}
                        />
                        <div className="relative w-11 h-6 bg-[#D1D1D1] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E57C65]"></div>
                      </label>
                      <p className="py-3 px-3 text-sm text-[#979797]">
                        나만의 장소를 선택할 경우, 다른 사람들이 회원님의 장소를
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
            <div className="px-8 py-3 flex gap-5 items-start sm:px-2">
              <h4 className="px-5 font-extrabold sm:px-0 sm:text-xs">도서</h4>
              <div>
                <BookSearch></BookSearch>
                {bookInfo && bookInfo.title && (
                  <div className="justify-items-start pt-4 px-5 sm:px-0">
                    <img
                      src={
                        bookInfo.thumbnail
                          ? bookInfo.thumbnail
                          : 'http://via.placeholder.com/120X150'
                      }
                      alt="책 표지"
                      className="mb-2 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex px-8 sm:px-0 py-3 mb-8 items-center ">
              <h4 className="px-5 sm:px-2 sm:text-sm font-extrabold">
                장소 태그
              </h4>
              <div className="flex flex-wrap max-w-[50vw] items-center">
                {selectedTag.length > 0 &&
                  selectedTag.map((tagContent: any, i: number) => (
                    <div
                      key={i}
                      className="box-border flex justify-center items-center px-4 py-2
          my-2 mx-2 text-xs/[10px] rounded-full bg-[#E57C65] text-white"
                    >
                      {tagContent}
                    </div>
                  ))}
                <button
                  onClick={() => setShowTagModal(true)}
                  className="cursor-pointer text-[#7a7a7a] font-light text-4xl sm:text-3xl"
                >
                  +
                </button>
              </div>
            </div>
            <CustomModal
              isOpen={showTagModal}
              onClose={() => setShowTagModal(false)}
              size={'60rem'}
              modalheight={'40rem'}
              modalColor="#fff"
            >
              <div className="mt-10 px-[10%] py-10 text-center">
                <div className="border-b-[2px]">
                  <h1 className="font-bold text-2xl text-left ">
                    장소와 딱맞는 태그를 선택해 주세요
                  </h1>
                  <div
                    className={`text-lg text-left py-3 ${selectedTag.length === 5 ? 'text-[#E57C65]' : 'text-[#AAAAAA]'}  border-b-[2px]`}
                  >
                    (키워드 5개 이하)
                  </div>
                  <div className="flex sm:flex-col gap-4 my-10 ">
                    {tagCategory.map((category: string, index: number) => (
                      <div
                        className="flex flex-col sm:grid sm:grid-cols-2"
                        key={index}
                      >
                        <div className="text-start mb-4">{category}</div>

                        {tagData &&
                          tagData
                            .filter((t: any) => t.category === category)
                            .map((tag: any, i: number) => (
                              <div className="flex">
                                <div
                                  key={i}
                                  className={`box-border flex justify-center items-center px-6 py-3
                 mr-2 mb-2 border rounded-[8px] text-xs/[10px] 
                 ${
                   selectedTag.includes(tag.content)
                     ? 'bg-[#FFE5E5] text-[#E57C65] border-[#E57C65]'
                     : 'bg-white  border-[#EAEAEA]'
                 }`}
                                  onClick={() => handleTagClick(tag.content)}
                                >
                                  {tag.content}
                                </div>
                              </div>
                            ))}
                      </div>
                    ))}
                    <div className="flex flex-col">
                      <div className="text-start mb-4 block min-h-[content] invisible">
                        취소
                      </div>
                      <div className="flex">
                        <div
                          className={`box-border flex justify-center items-center px-6 py-3
                          mr-2 mb-2 border rounded-[8px] text-xs/[10px] 
                          ${
                            allDeselect
                              ? 'bg-[#FFE5E5] text-[#E57C65] border-[#E57C65]'
                              : 'bg-white  border-[#EAEAEA]'
                          }`}
                          onClick={() => {
                            handleAllDeselect()
                          }}
                        >
                          선택할 키워드가 없어요
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mx-auto mb-10 w-[8rem]">
                <Button
                  label="확인"
                  outline={true}
                  onClick={() => {
                    setShowTagModal(false)
                  }}
                />
              </div>
            </CustomModal>

            <div className="py-8 border-[#A08A7E] border-t-2">
              <div className=" flex gap-4 justify-center items-center">
                <span
                  className={`inline-flex justify-center items-center gap-2 rounded-full px-3 py-3 text-xs font-medium ${
                    isPrivate
                      ? 'bg-[#E57C65] text-white'
                      : 'bg-white text-black'
                  }`}
                  onClick={handleIsPrivateClick}
                >
                  <Image
                    src={isPrivatedIcon}
                    alt="isPrivatedIcon"
                    width={13}
                    height={13}
                  />
                  나만보기
                </span>
                <span
                  className={`inline-flex items-center rounded-full gap-2 px-3 py-3 text-xs font-medium ${
                    !isPrivate
                      ? 'bg-[#E57C65] text-white'
                      : 'bg-[#F9f9f9] text-black'
                  }`}
                  onClick={handlePublicClick}
                >
                  <Image
                    src={isSharededIcon}
                    alt="isSharededIcon"
                    width={13}
                    height={13}
                  />
                  전체공개
                </span>
              </div>
              <div className="px-5 py-8">
                <div className="flex gap-2 pb-5">
                  <Image src={pen} alt="pen" width={30} height={30} />
                  <h1 className="font-extrabold text-xl">작성</h1>
                </div>
              </div>

              <textarea
                className="border border-slate-200 rounded-2xl w-full h-80 text-[#A08A7E] text-xs placeholder-[#A08A7E] bg-[#F9F9F9] px-3 py-3"
                placeholder="(1500자 이내로 독후감을 작성해주세요)"
                value={content}
                onChange={handleContent}
              />
            </div>
            <div>
              <div className="control_btn flex mx-auto w-[18rem] sm:pb-8 gap-5">
                <Button label="삭제하기" outline={false} />
                <Button
                  label="저장하기"
                  outline={true}
                  onClick={handleQAlert}
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
