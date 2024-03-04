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
import whitePaper from '/public/images//whitePager.png';
import { all } from 'node_modules/axios/index.cjs';

export interface PropType {
  params: {
    id: string
    searchParams: {}
  }
}

const BookLayoutItem = (props: any) => {
  const [bookData, setBookData] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState<boolean[]>([false, false, false])

  // TODO: 수정 삭제도 리코일로 관리할지? 논의 해봐용
  const [editReviewId, setEditReviewId] = useRecoilState(editReivewState)
  const [removeReviewId, setRemoveReviewId] = useRecoilState(removeReivewState)
  const [sortOption, setSortOption] = useRecoilState(sortOptionState);
  const [allReviewData, setAllReviewData] = useRecoilState(allReviewDataState);

  let session: any = useSession()
  const router = useRouter()

  function isBook(element: any) {
    if (element.bookRespDto && element.bookRespDto.isbn) {
      let bookId = element.bookRespDto.isbn.replace(' ', '')
      if (bookId === props.id) {
        return true
      }
    }
  }

  const handleSort = (option: 'latest' | 'oldest') => {
    setSortOption(option);
  };

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

    if (allReviewData) {

      let result = allReviewData.filter(isBook)
      console.log(result)
      setBookData(result)
      result.forEach(() => {
        arr.push(false)
      })
      setDetailOpen(arr)
    }
  }, [props.id, removeReviewId])
  console.log(bookData)

  return (
    <section className="bg-[#F1E5CF] mx-auto">
      {/* 램프&내 서재 */}
      <div className="grid relative mx-auto justify-center text-center mb-10">
        <Image
          src={lampIcon}
          className="inline-block text-center"
          alt={'lampIcon'}
          width={150}
          height={100}
        />
        <div>
        <div className="absolute bottom-8 left-0 right-0 mx-auto myCustomText text-3xl text-white">내 서재</div>
        </div>
      </div>
      {bookData && bookData[0] && (
        <div
          className={`mx-auto w-[80rem] max-w-[80rem] text-center p-4 border border-b-black`}
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
          <div className="p-4 text-xl text-[#503526] font-display font-bold ">
            {bookData[0].bookRespDto.title} | {bookData[0].bookRespDto.author} 작가
          </div>
        </div>
      )}
      <>
        <section className="main">
          <section className="pt-20 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
            <div className="md-pt-10 relative">
              <div className="lg-pt-10 md-pt-10 relative">
                <div className="absolute left-0">
                  <div className="flex py-4 md:py-8">
                    <div
                      id="filter"
                      className=" flex gap-3 text-gray-900 text-sm rounded-lg w-full p-2.5"
                    >
                      <div onClick={() => handleSort('latest')}>최신등록순</div>
                      <div onClick={() => handleSort('oldest')}>오래된순</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {bookData &&
              bookData.map((data: any, i: number) => (
                // 리스트
                <div
                  key={i}
                  onClick={() => {
                    handleModal(i)
                  }}
                  className="max-w-3xl my-4 mx-auto bg-cover bg-center rounded-lg overflow-hidden shadow-lg p-10"
                  style={{ backgroundImage: `url(${detailPaper.src})` }}
                >
                  {/* 모달 */}
                  {detailOpen && (
                    <CustomModal size={'70rem'} isOpen={detailOpen[i]} modalColor='#FEF6E6'>
                      <div className="">
                        <div className="px-8 py-8">
                          <div className="flex justify-center items-center">
                            <img
                              src={
                                bookData[0].bookRespDto.thumbnail
                                  ? bookData[0].bookRespDto.thumbnail
                                  : 'http://via.placeholder.com/120X150'
                              }
                              alt="책 표지"
                              className="w-[10rem] mb-2 rounded object-fll"
                            />
                            <div className='p-10'>
                              <div className="text-xl font-extrabold text-[#6F5C52]">
                                {data.title}
                              </div>
                              <div className="text-sm font-bold text-[#9C8A80]">
                                | {bookData[0].bookRespDto.author} 저자
                              </div>
                              <div className="justify-center items-center py-2">
                              <span
                              className={`inline-flex justify-center items-center gap-2 rounded-lg px-2 py-2 text-xs ${
                                data.isPrivate ? 'bg-[#E57C65] text-white'  : 'bg-white text-[#6F5C52]'
                              }`}
                            >
                            <Image
                              src={data.isPrivate ? isPrivatedIcon : isSharedIcon}
                              alt='Icon'
                              width={10}
                              height={10}
                            />
                              {data.isPrivate ? '나만보기' : '전체공개'}
                              </span>
                              </div>
                             <div className='py-5 pt-5 text-[#503526] text-sm'>
                              <div className="flex items-center gap-5">
                                <span className='font-bold' style={{ verticalAlign: 'middle' }}>등록일</span>
                                <div className=''>2024. 03. 03</div>
                              </div>
                              {/* TODO: 태그 부분 수정 필요함 컴포넌트를 직접 가져와서 해야할지? 아직 안해봤어요 */}
                              <div className="flex">
                                <span className='font-bold mr-4' style={{ verticalAlign: 'middle' }}>태그</span>
                                <div className='flex flex-wrap w-[16vw]'>
                                {data.tags.map(
                                  (tag: any) =>
                                    tag.isSelected && <div className='flex bg-[#E57C65] rounded-full m-1 p-2 text-white font-semibold text-xs'>#{tag.content}</div>,
                                )}
                              </div>
                              </div>
                              <div className="flex items-center gap-5">
                              <span className='font-bold' style={{ verticalAlign: 'middle' }}>장소</span>
                                <Link href={`/map/${session.data?.user.id}`}>
                                <div 
                                  className='flex items-center'>
                                  <Image
                                    src={privateMarker}
                                    alt={'장소'}
                                  />
                                  {data.pinRespDto.name}
                                  </div>
                                  </Link>
                              </div>
                              </div>
                            </div>
                          </div>
                          {/* 내용 엔터키 적용 */}
                          <div className='flex justify-center items-center'>
                          <div
                            key={i}
                            className="w-[50vw] my-4 rounded-lg overflow-hidden shadow-lg px-3 py-3 p-10 bg-[#FFFCF9]"
                          >
                            <div className="flex relative float-end items-center gap-4">
                            <Link href={'/edit/1'}>
                              <span className='text-[#D37C7C] text-sm font-bold'>수정</span>
                            </Link>
                            <span 
                             className='text-[#828282] text-sm font-bold'
                             onClick={() => handleRemove(data.isbn)}>삭제</span>
                          </div>
                          <div className='mt-10 px-5'>
                          <h2 className="text-2xl font-bold mb-4 border-black border-b pb-5 text-[#503526]">{data.title}</h2>
                            <div className="h-[45vh] mx-auto text-[#999999]" dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br>') }}>
                            </div>
                            </div>
                        </div>
                        </div>
                        </div>
                      </div>
                    </CustomModal>
                  )}
                  {/* 리스트 내부 글자 */}
                  <div className="">
                    <div className="flex justify-between">
                      <div className="text-3xl font-black ml-2 pt-2 mb-2">
                        {data.title}
                      </div>
                      <div className="grid justify-itmes-center">
                        <div>2024.03.01</div>
                        <Image
                          src={data.private ? Private : unLock}
                          alt="private"
                          style={{ width: '25px', height: '25px' }}
                          className=" mt-1 justify-self-center"
                        />
                      </div>
                    </div>
                    <div className="flex align-center ">
                      <Image
                        src={privateMarker}
                        alt="marker"
                        className="mx-1"
                      />
                      <div className="text-gray-500 text-sm font-semibold">
                        독서장소: {data.pinRespDto?.name} |{' '}
                        {data.pinRespDto.address}
                      </div>
                    </div>
                    {/* TODO:내용 글자 많으면 ...으로 표시하기 */}
                    <p className="text-sm font-semibold pt-12">{data.content}</p>
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
