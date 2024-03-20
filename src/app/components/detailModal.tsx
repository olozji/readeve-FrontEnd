'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import privateMarker from '/public/images/privateMarker.png'
import closeIcon from '/public/images/closeIcon.png';
import privateIcon from '/public/images/privateIcon.png'
import sharedIcon from '/public/images/sharedIcon.png'
import CustomAlert from './alert';
import axios from 'axios';

interface ModalContentProps {
  bookData?: any;
  data: any;
  sessionUserId: string | undefined;
  closeModal: () => void;
  isMyPage?:boolean
}

const ModalContent: React.FC<ModalContentProps> = ({
  data,
  sessionUserId,
  closeModal,
  isMyPage
}) => {
  const formatDateToYYMMDD = (isoDateString: string) => {
    const date = new Date(isoDateString)
    return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
  }
  const handleCloseQAlert = () => {
    setShowQAlert(false)
  }
  const handleRemove = async(reviewId: number) => {
    
    try {
    const selectedTags = data.tags.filter((tag: any) => tag.selected).map((tag: any) => tag.content);

    await axios.delete(`https://api.bookeverywhere.site/api/review/delete/${reviewId}?socialId=${data.socialId}&bookTitle=${data.bookRespDto.title}&address=${data.bookRespDto.address}&tags=${selectedTags}`)
    console.log('리뷰 삭제 성공:');
    // 삭제 요청이 성공한 경우의 처리
  } catch(error) {
    console.error('리뷰 삭제 실패:', error);
      // 삭제 요청이 실패한 경우의 처리
      
      //TODO: 이 부분은 서버에서 에러 안 나오게 되면 위로 올려야 합니다
      window.location.href = `/mypage/${sessionUserId}`
      //
  };

  }
  const [showQAlert, setShowQAlert] = useState(false);

  function maskName(name: string): string {
    if (name.length === 2) {
      return name.charAt(0) + '*';
    } else if (name.length > 2) {
      const firstChar = name.charAt(0);
      const lastChar = name.charAt(name.length - 1);
      const maskedPart = '*'.repeat(name.length - 2);
      return firstChar + maskedPart + lastChar;
    } else {
      return name;
    }
  }

  return (
    <div className="">
      {showQAlert && (
            <CustomAlert
              message={'독후감을 삭제하시겠습니까?'}
              onClose={handleCloseQAlert}
              isActive={true}
              active={() => handleRemove(data.reviewId)}
            />
          )}
      <div className="px-8 py-8 sm:px-2">
        <Image
          src={closeIcon}
          alt='closeIcon'
          className='float-right cursor-pointer'
          onClick={closeModal}
        />
        <div className="flex sm:flex-col justify-center items-center">
          <img
            src={
              data.bookRespDto.thumbnail
                ? data.bookRespDto.thumbnail
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
              | {data.bookRespDto.author} 저자
            </div>
            <div className="justify-center items-center py-2">
              <span
                className={`inline-flex justify-center items-center gap-2 rounded-lg px-2 py-2 text-xs ${
                  data.private ? 'bg-[#E57C65] text-white' : 'bg-white text-[#6F5C52]'
                }`}
              >
                  <Image
                    src={
                      data.private
                        ? privateIcon
                        : sharedIcon
                    }
                    alt="Icon"
                    width={10}
                    height={10}
                  />
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
                <span className="font-bold mr-4 sm:block sm:mr-0" style={{ verticalAlign: 'middle' }}>
                  태그
                </span>
                <div className="flex flex-wrap w-[16vw] sm:w-[40vw]">
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
              <div className="flex items-center gap-5 sm:gap-0">
                <span className="font-bold" style={{ verticalAlign: 'middle' }}>
                  장소
                </span>
                <div className="flex items-center">
                  {data.pinRespDto && (
                    <>
                      <Image src={privateMarker} alt={'장소'} />
                      {data.pinRespDto.private ? (
                                  <div>{maskName(data.writer)}님만의 장소</div>
                                ) : (
                                  <div className="">
                                    독서장소: {data.pinRespDto?.name} |{' '} <br/>
                                    {data.pinRespDto?.address}
                                  </div>
                                )}
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
            {isMyPage&&<div className="flex relative float-end items-center gap-4 sm:top-4">
              <Link href={`/edit/${data.reviewId}`}>
                <span className="text-[#D37C7C] text-sm font-bold">수정</span>
              </Link>
              {/* {sessionUserId && sessionUserId === data.userId && (
                <span
                  className="text-[#828282] text-sm font-bold"
                  onClick={() => handleRemove(data.isbn)}
                >
                  삭제
                </span>
              )} */}

                <span
                  className="text-[#828282] text-sm font-bold"
                  onClick={() => setShowQAlert(true)}
                >
                  삭제
                </span>

            </div>}
            
            <div className="mt-10 px-5">
              <h2 className="text-2xl sm:text-lg font-bold mb-4 border-black border-b pb-5 text-[#503526]">
                {data.title}
              </h2>
              <div
                className="h-[45vh] mx-auto text-[#999999] overflow-y-auto max-h-[45vh]"
                dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br>') }}
              ></div> 
             
              {/* 어차피 20자로 제한둘거니까 상관없는 코드 같아서 원래대로 하는게 좋을 것 같아요 일단 주석처리 해놓을게용 */}
                {/* <div className="h-[45vh] mx-auto text-[#999999] overflow-y-auto max-h-[45vh]">
              {data.content.split('\n').map((p:any, index:any) => (
                <p key={index}>{p}</p>
              ))}
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalContent
