import { dividerClasses } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import NotesImg from '/public/images/notesImg.png'
import { useRecoilState } from 'recoil'
import { allReviewDataState } from '@/store/writeAtoms'

interface bookLayoutProps {
  isMain: boolean
  bookData: any
  width: string
}
export const BookLayout = ({ width, isMain, bookData }: bookLayoutProps) => {
  const [documents, setDocuments] = useState<any[]>([])
  const [parsedData, setParsedData] = useState<any[]>([])
  const [startIdx, setStartIdx] = useState(0)
  const [allReviewData, setAllReviewData] =
    useRecoilState<any>(allReviewDataState)
  const numVisibleBooks = 5

  useEffect(() => {
    const onlyBookData = bookData.filter((data: any, idx: number) => {
      return (
        bookData.findIndex((data1: any) => {
          return data.bookRespDto.isbn === data1.bookRespDto.isbn
        }) === idx
      )
    })
    setDocuments(onlyBookData)
  }, [bookData])

  const handleClickPrev = () => {
    setStartIdx(Math.max(0, startIdx - numVisibleBooks))
  }

  const handleClickNext = () => {
    setStartIdx(
      Math.min(documents.length - numVisibleBooks, startIdx + numVisibleBooks),
    )
  }

  return (
    <div>
      {documents.length !== 0 && (
        <div className="flex justify-center">
          <div className={`flex justify-between items-center w-${width} `}>
            <div className="p-2 cursor-pointer" onClick={handleClickPrev}>
              &lt;
            </div>
            <div className="flex items-start">
              <div className="grid grid-cols-5 gap-4 justify-center ">
                {documents
                  .slice(startIdx, startIdx + numVisibleBooks)
                  .map((d: any, i: number) => (
                    <Link
                      key={i}
                      href={`/detail/${d.bookRespDto && d.bookRespDto.isbn ? d.bookRespDto.isbn.replace(' ', '') : ''}`}
                    >
                      <div className="flex flex-col items-center rounded-lg border-4 border-transparent p-4 cursor-pointer">
                        <img
                          src={
                            d.bookRespDto.thumbnail
                              ? d.bookRespDto.thumbnail
                              : 'http://via.placeholder.com/120X150'
                          }
                          alt="책 표지"
                          className="mb-2 rounded-lg w-[8vw]"
                        />
                        {isMain && (
                          <div className="flex gap-2 w-[8vw] items-center">
                            <span className="flex items-center justify-center max-h-10 rounded-lg gap-1 bg-[#E1E1E1] px-3 py-1 text-xs font-medium text-[#5F5F5F]">
                              <Image
                                src={NotesImg}
                                alt={'NotesImg'}
                                width={10}
                                height={10}
                              />
                              {
                                bookData.filter(
                                  (data: any) =>
                                    data.bookRespDto.isbn ===
                                    d.bookRespDto.isbn,
                                ).length
                              }{' '}
                            </span>
                            <div className="px-1 py-1 text-[#5F5F5F] text-sm">
                              {d.bookRespDto.title}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="p-2 cursor-pointer" onClick={handleClickNext}>
              &gt;
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
