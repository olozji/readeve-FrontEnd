import { bookState } from '@/store/writeAtoms'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import Button from './buttons/button'
import mapSearchIcon from '/public/images/mapSearchIcon.png'
import Image from 'next/image'

interface BookType {
 edit?:any
}

export const BookSearch = ({edit}:BookType) => {
  const [bookName, setBookName] = useState<string>('')
  const [page, setPage] = useState(1)
  const [last, setLast] = useState(1)
  const [documents, setDocuments] = useState<any>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [bookInfo, setBookInfo] = useRecoilState<any>(bookState)

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!bookName) return // 빈 검색어인 경우 API 호출하지 않음
    callAPI()
  }, [page]) // 페이지가 변경될 때마다 호출
  useEffect(() => {
    console.log(selectedBook)
  }, [selectedBook])

  const callAPI = async () => {
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${bookName}&page=${page}&size=10`
    const config = {
      headers: { Authorization: `KakaoAK 4a3294385b3e838f9f020a39fe8c04e3` },
    }
    try {
      setBookInfo({})
      const result = await axios.get(url, config)
      setDocuments(result.data.documents)
      const total = result.data.meta.pageable_count
      setLast(Math.ceil(total / 10))
      setModalOpen(true) // API 호출 후 모달 열기
      console.log(documents)
    } catch (error) {
      console.error('데이터 가져오기 오류:', error)
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent default form submission behavior
      onSubmit(e) // Trigger search when Enter key is pressed
    }
  }
  const formatDate = (dateTimeString:any) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  }
  

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault() // 기본 제출 이벤트 방지
    setPage(1) // 새로운 검색을 위해 페이지를 1로 초기화
    callAPI()
  }

  const nextPage = (e: any) => {
    e.preventDefault()
    const container = document.querySelector('.scrollBar'); // 상위 div 박스의 클래스명으로 선택

    if (container) {
      container.scrollTop = 0; // 스크롤을 맨 위로 이동
    }
    setPage((prevPage) => Math.min(last, prevPage + 1))
  }

  const prevPage = (e: any) => {
    e.preventDefault()
    const container = document.querySelector('.scrollBar'); // 상위 div 박스의 클래스명으로 선택

    if (container) {
      container.scrollTop = 0; // 스크롤을 맨 위로 이동
    }
    setPage((prevPage) => Math.max(1, prevPage - 1))
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const closeOnOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      e.preventDefault()
      setModalOpen(false)
    }
  }
  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      let selectedBookInfo = {
        isbn: selectedBook.isbn,
        title: selectedBook.title,
        thumbnail: selectedBook.thumbnail,
        authors: selectedBook.authors,
      }
      setBookInfo(selectedBookInfo)
      console.log(bookInfo)
    }
    setModalOpen(false)
  }
  const handleBookClick = (data: any) => {
    let copy = data
    setSelectedBook(copy)
  }

  return (
    <div className="flex px-3 max-w-[60vw] sm:px-0">
      <input
        className="inline-block w-[35rem] h-[2rem] text-xs/[10px] px-3 rounded-2xl  bg-[#F9F9F9] placeholder-[#A08A7E] gap-4 sm:gap-0"
        ref={inputRef}
        type="text"
        placeholder="책 제목을 입력해주세요"
        value={bookInfo?bookInfo.title:selectedBook?selectedBook.title:''}
        onClick={() => setModalOpen(true)}
        onChange={(e) => setBookName(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeOnOverlayClick}
        >
         <div className="bg-white w-[60rem] sm:w-[100vw] max-h-[80vh] py-8 px-16  sm:px-4 rounded-lg overflow-y-auto">
            <div className="pt-4 text-3xl sm:text-2xl font-extrabold">
              도서명을 검색해주세요
            </div>
            <div className="pt-8 pb-4 border-b-2 sm:pt-4 flex">
              <input
                type="text"
                size={50}
                placeholder="입력"
                onChange={(e) => setBookName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSubmit(e);
                  }
                }}
                className="w-[35rem] sm:w-[100%] h-[2.5rem] px-3 border border-black rounded-2xl bg-white"
              />
              <div className="bg-[#E57C65] border-4 border-white mx-4 px-2 py-1 rounded-3xl shadow-xl justify-center">
                <button id="searchBtn" onClick={onSubmit} onSubmit={onSubmit}>
                  <Image
                    src={mapSearchIcon}
                    alt="mapSearchIcon"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
           
            <div className="grid grid-cols-1 overflow-y-auto max-h-[37vh] mt-4 justify-items-start">
              {documents.map((d: any, i: number) => (
               <div  className={` w-[100%] sm:max-h-[30vh] block ${selectedBook && selectedBook.isbn === d.isbn ? 'rounded-[13px] border-4 border-[#E57c65]' : 'rounded-lg border-4 border-transparent'}`}>
                <div
                  className='flex align-center'
                  key={i}
                  onClick={() => handleBookClick(d)}
                  
                >
                  <img
                    src={
                      d.thumbnail
                        ? d.thumbnail
                        : 'http://via.placeholder.com/120X150'
                    }
                    alt="책 표지"
                    className="m-2 rounded-2xl"
                    />
                    <div className="p-4 mt-2 sm:text-sm">
                      <div className='font-black text-lg lg:text-xl '>{d.title}</div>
                      <div className='font-semibold text-[#646464]'>| 지은이 {d.authors[0]}</div>
                      <div className='pt-8  font-bold'>출판사:{d.publisher}</div>
                      <div className='font-bold'>출판일 : {formatDate(d.datetime)}</div>
                  </div>
                </div>
               </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={prevPage}
                className="px-4 py-2 bg-[#e57c65] text-white rounded"
              >
                이전
              </button>
              <span className="text-lg font-semibold">
                {page}/{last}
              </span>
              <button
                onClick={nextPage}
                className="px-4 py-2 bg-[#e57c65]  text-white rounded"
              >
                다음
              </button>
            </div>
            <div className="mt-4 text-center flex gap-4 justify-center">
              
              <button
                onClick={() => handleConfirmation(false)}
                className="px-4 py-2 bg-[#65AFE5] text-white rounded-full"
              >
                취소
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="px-4 py-2 bg-[#e57c65]  text-white rounded-full"
              >
              확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
