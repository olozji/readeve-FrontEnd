import React from 'react'
import Image from 'next/image';
import privateMarker from '/public/images/privateMarker.png'
import Link from 'next/link';

interface ModalContentProps {
  bookData: any;
  data: any;
  sessionUserId: string | undefined;
  handleRemove: (isbn: string) => void;
}

const ModalContent: React.FC<ModalContentProps> = ({
  bookData,
  data,
  sessionUserId,
  handleRemove,
}) => {
  const formatDateToYYMMDD = (isoDateString: string) => {
    const date = new Date(isoDateString)
    return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
  }

  return (
    <div className="">
      <div className="px-8 py-8">
        <div className="flex sm:flex-col justify-center items-center">
          <img
            src={
              bookData[0].bookRespDto.thumbnail
                ? bookData[0].bookRespDto.thumbnail
                : 'http://via.placeholder.com/120X150'
            }
            alt="책 표지"
            className="w-[10rem] mb-2 rounded object-fll"
          />
          <div className="p-10 sm:p-0">
            <div className="text-xl font-extrabold text-[#6F5C52]">
              {data.bookRespDto.title}
            </div>
            <div className="text-sm font-bold text-[#9C8A80]">
              | {bookData[0].bookRespDto.author} 저자
            </div>
            <div className="justify-center items-center py-2">
              <span
                className={`inline-flex justify-center items-center gap-2 rounded-lg px-2 py-2 text-xs ${
                  data.private ? 'bg-[#E57C65] text-white' : 'bg-white text-[#6F5C52]'
                }`}
              >
                {data.private ? '나만보기' : '전체공개'}
              </span>
            </div>
            <div className="py-5 pt-5 text-[#503526] text-sm">
              <div className="flex items-center gap-5">
                <span className="font-bold" style={{ verticalAlign: 'middle' }}>
                  등록일
                </span>
                <div>{formatDateToYYMMDD(data.createAt)}</div>
              </div>
              <div className="flex">
                <span className="font-bold mr-4" style={{ verticalAlign: 'middle' }}>
                  태그
                </span>
                <div className="flex flex-wrap w-[16vw]">
                  {data.tags.map(
                    (tag: any) =>
                      tag.selected && (
                        <div className="flex bg-[#E57C65] rounded-full m-1 p-2 text-white font-semibold text-xs">
                          #{tag.content}
                        </div>
                      )
                  )}
                </div>
              </div>
              <div className="flex items-center gap-5">
                <span className="font-bold" style={{ verticalAlign: 'middle' }}>
                  장소
                </span>
                <div className="flex items-center">
                  {data.pinRespDto && (
                    <>
                      <Image src={privateMarker} alt={'장소'} />
                      {data.pinRespDto.name}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 내용 엔터키 적용 */}
        <div className="flex justify-center items-center">
          <div
            className="w-[50vw] sm:w-[90vw] my-4 rounded-lg overflow-hidden shadow-lg px-3 py-3 sm:pt-0 p-10 bg-[#FFFCF9]"
          >
            <div className="flex relative float-end items-center gap-4">
              <Link href={`/edit/${data.reviewId}`}>
                <span className="text-[#D37C7C] text-sm font-bold">수정</span>
              </Link>
              {sessionUserId && sessionUserId === data.userId && (
                <span
                  className="text-[#828282] text-sm font-bold"
                  onClick={() => handleRemove(data.isbn)}
                >
                  삭제
                </span>
              )}
            </div>
            <div className="mt-10 px-5">
              <h2 className="text-2xl sm:text-lg font-bold mb-4 border-black border-b pb-5 text-[#503526]">
                {data.title}
              </h2>
              <div
                className="h-[45vh] mx-auto text-[#999999]"
                dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br>') }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalContent
