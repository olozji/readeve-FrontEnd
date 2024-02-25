import { dividerClasses } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface bookLayoutProps {
  isMain: boolean
}
export const BookLayout = ({ isMain }: bookLayoutProps) => {
  const [documents, setDocuments] = useState<any[]>([])
  const [startIdx, setStartIdx] = useState(0)
  const numVisibleBooks = 5

  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      const onlyBookData = parsedData.filter((data: any, idx: number) => {
        return (
          parsedData.findIndex((data1: any) => {
            return data.book.isbn === data1.book.isbn
          }) === idx
        )
      })
      setDocuments(onlyBookData)
    }
  }, [])

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
      {isMain ? (
        <div className="flex justify-between items-center">
          <div className="p-2 cursor-pointer" onClick={handleClickPrev}>
              &lt;
            </div>
          <div className="grid grid-cols-5 gap-4 justify-center items-center">
            {documents
              .slice(startIdx, startIdx + numVisibleBooks)
              .map((d: any, i: number) => (
                <Link
                  key={i}
                  href={`/detail/${d.book && d.book.isbn ? d.book.isbn.replace(' ', '') : ''}`}
                >
                  <div className="flex flex-col items-center rounded-lg border-4 border-transparent p-4 cursor-pointer">
                    <img
                      src={
                        d.book.thumbnail
                          ? d.book.thumbnail
                          : 'http://via.placeholder.com/120X150'
                      }
                      alt="책 표지"
                      className="mb-2 rounded"
                    />
                    <div className="text-center">{d.book.title}</div>
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
      ) : (
        <div className="grid grid-cols-5 ">
          {documents.map((d: any, i: number) => (
            <Link
              key={i}
              href={`/detail/${d.book && d.book.isbn ? d.book.isbn.replace(' ', '') : ''}`}
            >
              <div
                className={`justify-items-center rounded-lg border-4 border-transparent`}
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={
                    d.book.thumbnail
                      ? d.book.thumbnail
                      : 'http://via.placeholder.com/120X150'
                  }
                  alt="책 표지"
                  className="mb-2 rounded"
                />
                <div className="p-4">{d.book.title}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
