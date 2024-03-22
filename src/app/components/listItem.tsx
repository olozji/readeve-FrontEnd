'use client'

import { mapState } from '@/store/mapAtoms'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Image from 'next/image'
import Private from '/public/images/privateIcon.png'
import linkArrow from '/public/images/linkArrow.png'
import blackLinkArrow from '/public/images/blackLinkArrow.png'
import unLock from '/public/images/sharedIcon.png'
import hoverPrivateMarker from '/public/images/hoverPrivateMarker.png'
import privateMarker from '/public/images/privateMarker.png'
import CustomModal from './modal';
import ModalContent from './detailModal';

interface listItemProps {
  data: any
  onListItemClick: (pinRespDto: any, i: number) => void
  index: number
  isShared: boolean
  selectedMarkerIndex: string
  onListMouseLeave:(i:number)=>void
}

const ListItem = ({
  data,
  onListItemClick,
  index,
  isShared,
  selectedMarkerIndex,
  onListMouseLeave
}: listItemProps) => {
  const [recoilMap] = useRecoilState<any>(mapState)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [iscontentExpanded, setIsContentExpanded] = useState(false)
  const [detailOpen,setDetailOpen] = useState(false)

  const mouseLeaveList = (i: number) => {
    onListMouseLeave(i)
    setIsSelected(false)
    setIsHovered(false)
  }
  const handleModal = () => {
    setDetailOpen(!detailOpen)
  }

  // useEffect(() => {
  //   if (selectedMarkerIndex === data.pinRespDto.id) {
  //     setIsHovered(true)
  //   } else {
  //     setIsHovered(false)
  //   }
  // }, [selectedMarkerIndex])

  useEffect(() => {
    if (selectedMarkerIndex === data.pinRespDto.placeId) {
      setIsSelected(true)
    } else {
      setIsSelected(false)
    }
  }, [selectedMarkerIndex])


  return (
    <div className="opacity-100 sm:flex sm:whitespace-nowrap  ">
      {isShared ? (
        <div
        className={`relative text-left block pt-6 my-2 sm:w-[94vw] 
        border rounded-2xl shadow z-50 sm:mx-[1vw] hover:bg-[#E57C65] hover:border-[#e57c65] hover:border-2 hover:text-white 
        ${isSelected ? 'bg-[#E57C65] border-[#E57C65] border-2 text-white' : 'bg-white border-gray-200'}
        `}
          onClick={() => onListItemClick(data.pinRespDto, index)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={()=>mouseLeaveList(index)}
        >
          <div className="flex justify-between px-6">
            <h5 className="mb-2 text-xl max-w-[10vw] sm:max-w-[70vw] px-2 font-bold tracking-tight">
              {data.pinRespDto.name
                ? data.pinRespDto.name
                : data.pinRespDto.address}
            </h5>
            <Link href={data.pinRespDto.url ? data.pinRespDto.url : ''} className={data.pinRespDto.url&&data.pinRespDto.url=='누군가의 장소'?'hidden':''}>
              <div
                className={`text-xs underline decoration-solid ${isHovered ? 'text-white' : 'text-gray'}`}
              >
                카카오맵으로 자세히보기
              </div>
            </Link>
          </div>
          <div>
            <div className="flex my-2 px-6 items-center">
              <Image
                src={isHovered ? hoverPrivateMarker : privateMarker}
                alt="hoverPrivateMarker"
                className="mr-1 w-4 h-4"
                width={15}
                height={10}
              />
              <p className="text-sm sm:text-xs">{data.pinRespDto.address}</p>
            </div>
            {!isHovered && (
              <div className="px-6">
                <hr />
              </div>
            )}
          </div>
          <div
            className={`pt-2 pb-6 grid grid-cols-2 rounded-b-2xl px-6 ${isHovered ? 'bg-white text-black' : ''}`}
          >
            {data &&
              data.tags.map(
                (tag: any, i: number) =>
                  tag.selected && (
                    <div className="text-[#464646] py-1 text-xs">
                      #{tag.content}
                    </div>
                  ),
              )}
          </div>
        </div>
      ) : (
        <div
        className={`relative text-left block p-6 my-2 sm:mx-[1vw] sm:w-[94vw] 
        border  text-[#3D3D3D] border-gray-200 rounded-lg shadow z-50 hover:bg-[#e57c65] hover:text-white 
        ${isSelected ? 'bg-[#E57C65] border-[#E57C65] border-2 text-white' : 'bg-white border-gray-200'}
        `}
          onClick={() => onListItemClick(data.pinRespDto, index)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={()=>mouseLeaveList(index)}
            
          >
            {detailOpen && (
                    <CustomModal
                      size={'70rem'}
                      isOpen={detailOpen}
                      modalColor="#FEF6E6"
                    >
                     <ModalContent
                      data={data}
                      sessionUserId={data.socialId}
                        closeModal={handleModal}
                        isMyPage={true}
                     />
                    </CustomModal>
                  )}
          <div className="gap-3 mb-3">
            <div className="flex gap-3">
              <div className="flex">
                <h5 className="mb-2 text-lg font-bold tracking-tight">
                  {data.bookRespDto?.title}
                </h5>
                <Image
                  src={data.private ? Private : unLock}
                  alt="private"
                    width={10}
                    className='ml-2'
                />
              </div>

              <button
                onClick={handleModal}
              >
                <Image
                  src={isHovered ? linkArrow : blackLinkArrow}
                  alt="linkArrow"
                  className="absolute right-6"
                  width={15}
                  height={10}
                />
                </button>
                
              </div>
              <div className='mb-2'>
            <div className="flex align-center items-center">
              <Image
                src={isHovered ? hoverPrivateMarker : privateMarker}
                alt="hoverPrivateMarker"
                className="mr-1 w-4 h-4"
              />
              <h5 className="text-sm font-bold tracking-tight">
                {data.pinRespDto.name
                  ? data.pinRespDto.name
                  : data.pinRespDto.address}
              </h5>
            </div>
                <p className="text-xs">{data.pinRespDto.address}</p>
                </div>
          </div>
          <p
            className={`font-normal ${iscontentExpanded ? 'whitespace-pre-line' : 'line-clamp-2'} text-sm`}
          >
            {data.content}
          </p>
        </div>
      )}
    </div>
  )
}

export default ListItem
