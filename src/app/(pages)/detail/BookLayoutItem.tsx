'use client'
import Button from '@/app/components/buttons/button'
import CustomModal from '@/app/components/modal'
import {
  allReviewDataState,
  bookState,
  editReivewState,
  removeReivewState,
  sortOptionState,
} from '@/store/writeAtoms'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import Private from '/public/images/private.png'
import unLock from '/public/images/unLock.png'
import lampIcon from '/public/images/lampicon.png'
import detailPaper from '/public/images/detailPaper.png'
import privateMarker from '/public/images/privateMarker.png'
import isPrivatedIcon from '/public/images/isPrivatedIcon.png'
import isSharedIcon from '/public/images/isSharedIcon.png'
import whitePaper from '/public/images//whitePager.png'
import { all } from 'node_modules/axios/index.cjs'
import axios from 'axios'
import ModalContent from '@/app/components/detailModal'

interface bookLayoutItemType {
  bookId: string
  propsData: any
}

const BookLayoutItem = ({ bookId, propsData }: bookLayoutItemType) => {
  const [bookData, setBookData] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState<boolean[]>([false, false, false])

  // TODO: 수정 삭제도 리코일로 관리할지? 논의 해봐용
  const [editReviewId, setEditReviewId] = useRecoilState(editReivewState)
  const [removeReviewId, setRemoveReviewId] = useRecoilState(removeReivewState)
  const [sortOption, setSortOption] = useRecoilState(sortOptionState)

  let session: any = useSession()
  const router = useRouter()

  function formatDateToYYMMDD(isoDateString: string) {
    const date = new Date(isoDateString)
    return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
  }
  function isBook(element: any) {
    return element?.bookRespDto?.isbn?.replace(' ', '') === bookId
  }

  const handleSort = (option: 'latest' | 'oldest') => {
    setSortOption(option)
  }

  const handleModal = (idx: number) => {
    let copy = []
    for (let i = 0; i < detailOpen.length; i++) {
      if (i == idx) {
        copy.push(!detailOpen[i])
      } else {
        copy.push(detailOpen[i])
      }
    }
    setDetailOpen(copy)
  }

  // 독후감 삭제 TODO: API 아직 몰라서 로컬에서 삭제되는 부분으로 처리 했어요 나중에 로직을 바꿔야 할듯
  // 수정은 edit에서 구현되어 있는 것 같아서 냅뒀어요!
  const handleRemove = (isbn: string) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      const allReviewData = localStorage.getItem('allDataInfo')

      if (allReviewData) {
        const parsedData: any[] = JSON.parse(allReviewData)

        // isbn을 통해 독후감을 삭제
        const updatedData = parsedData.filter((item) => !isBook(item))
        localStorage.setItem('allDataInfo', JSON.stringify(updatedData))

        setBookData(updatedData)

        router.push(`/mypage/${session.data?.user.id}`)
      }
    }
  }

  useEffect(() => {
    let arr: boolean[] = []

    console.log(`bookId=${bookId}`)
    console.log(`propsData=${propsData}`)
    let result = propsData.filter(
      (data: any) => data.bookRespDto.isbn.replace(' ', '') == bookId,
    )
    console.log(result)
    setBookData(result)
    result.forEach(() => {
      arr.push(false)
    })
    setDetailOpen(arr)
  }, [bookId, removeReviewId])

  return (
    <section>
      {bookData && bookData[0] && (
        <div
          className={`mx-auto max-w-[80rem] text-center p-4 border-b-[0.5px] border-white`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={
              bookData[0].bookRespDto.thumbnail
                ? bookData[0].bookRespDto.thumbnail
                : 'http://via.placeholder.com/120X150'
            }
            alt="책 표지"
            className="mb-2 rounded-xl drop-shadow-lg"
          />
          <div className="p-4 text-lg text-[#503526] font-display font-bold ">
            {bookData[0].bookRespDto.title} | {bookData[0].bookRespDto.author}{' '}
            작가
          </div>
        </div>
      )}
      <>
        <section className="main">
          <section className="pt-20 sm:pt-10 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
            {/* {bookData && (
              <div className="md-pt-10 relative">
                <div className="lg-pt-10 md-pt-10 relative">
                  <div className="absolute left-0">
                    <div className="flex py-4 md:py-8">
                      <div
                        id="filter"
                        className=" flex gap-3 text-gray-900 text-sm rounded-lg w-full p-2.5"
                      >
                        <div onClick={() => handleSort('latest')}>
                          최신등록순
                        </div>
                        <div onClick={() => handleSort('oldest')}>오래된순</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            {bookData &&
              bookData.map((data: any, i: number) => (
                // 리스트
                <div
                  key={i}
                  onClick={() => {
                    handleModal(i)
                  }}
                  className="max-w-4xl my-4 mx-auto bg-cover bg-center rounded-lg overflow-hidden shadow-lg sm:p-2 p-10"
                  style={{ backgroundImage: `url(${detailPaper.src})` }}
                >
                  {/* 모달 */}
                  {detailOpen && (
                    <CustomModal
                      size={'70rem'}
                      isOpen={detailOpen[i]}
                      modalColor="#FEF6E6"
                    >
                     <ModalContent
                      bookData={bookData}
                      data={data}
                      sessionUserId={session.data?.user.id}
                      handleRemove={handleRemove}
                        closeModal={() => handleModal(i)}
                        isMyPage={true}
                     />
                    </CustomModal>
                  )}
                  {/* 리스트 내부 글자 */}
                  <div className="relative sm:p-2">
                    <div className="flex justify-between ">
                      <div className="flex justify-between items-center text-2xl sm:text-base font-black pt-2  mb-2">
                        <div>{data.title}</div>
                        <Image
                          src={data.private ? Private : unLock}
                          alt="private"
                          style={{ width: '25px', height: '25px' }}
                          className=" mt-1 justify-self-center"
                        />
                      </div>
                      <div className="grid absolute bottom-0 right-0 sm:bottom-0 sm:right-2 sm:text-xs justify-itmes-center">
                        {formatDateToYYMMDD(data.createAt)}
                        
                      </div>
                    </div>
                    <div className="flex align-center ">
                      {/* <Image
                        src={privateMarker}
                        alt="marker"
                        className="mx-1"
                      /> */}
                      <div className="text-gray-500 text-sm sm:text-xs font-semibold">
                        독서장소: {data.pinRespDto?.name} |{' '}
                        {data.pinRespDto.address}
                      </div>
                    </div>
                    {/* TODO:내용 글자 많으면 ...으로 표시하기 */}
                    <p className="text-sm font-semibold text-[#767676] max-w-[50vw] pt-12 sm:pt-6 sm:ml-2 sm:text-xs">
                      {data.content}
                    </p>
                  </div>
                </div>
              ))}
          </section>
        </section>
      </>
    </section>
  )
}

export default BookLayoutItem
