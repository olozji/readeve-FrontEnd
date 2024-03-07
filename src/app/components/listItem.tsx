'use client'

import { mapState } from '@/store/mapAtoms'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Image from 'next/image'
import Private from '/public/images/private.png'
import linkArrow from '/public/images/linkArrow.png'
import blackLinkArrow from '/public/images/blackLinkArrow.png'
import unLock from '/public/images/unLock.png'
import hoverPrivateMarker from '/public/images/hoverPrivateMarker.png'
import privateMarker from '/public/images/privateMarker.png'

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
  const [iscontentExpanded, setIsContentExpanded] = useState(false)

  const mouseLeaveList = (i: number) => {
    onListMouseLeave(i)
    setIsHovered(false)
  }

  useEffect(() => {
    if (selectedMarkerIndex === data.pinRespDto.id) {
      setIsHovered(true)
    } else {
      setIsHovered(false)
    }
  }, [selectedMarkerIndex])
  return (
    <div className="opacity-100">
      {isShared ? (
        <div
          className={`relative text-left block pt-6 my-2 
          border  rounded-2xl shadow z-50 hover:bg-[#E57C65] hover:border-[#e57c65] hover:border-2 hover:text-white  ${isHovered ? 'bg-[#E57C65] border-[#E57C65] border-2 text-white' : 'bg-white border-gray-200'}`}
          onClick={() => onListItemClick(data.pinRespDto, index)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={()=>mouseLeaveList(index)}
        >
          <div className="flex justify-between px-6">
            <h5 className="mb-2 text-xl max-w-[10vw] font-bold tracking-tight">
              {data.pinRespDto.name
                ? data.pinRespDto.name
                : data.pinRespDto.address}
            </h5>
            <Link href={data.pinRespo.url!=='누군가의 장소' ? data.pinRespDto.url : ''} className={data.pinRespo.url!=='누군가의 장소' ?'hidden': ''}>
              <div
                className={`text-xs underline decoration-solid ${isHovered ? 'text-white' : 'text-gray'}`}
              >
                카카오맵으로 자세히보기
              </div>
            </Link>
          </div>
          <div>
            <div className="flex my-2 px-6">
              <Image
                src={isHovered ? hoverPrivateMarker : privateMarker}
                alt="hoverPrivateMarker"
                className="mr-2"
                width={16}
                height={10}
              />
              <p className="text-sm">{data.pinRespDto.address}</p>
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
                    <div className="text-gray-600 py-1 text-xs">
                      #{tag.content}
                    </div>
                  ),
              )}
          </div>
        </div>
      ) : (
        <div
          className="relative text-left block p-6 my-2
            border bg-white border-gray-200 rounded-lg shadow z-50 hover:bg-[#E57C65] hover:text-white"
          onClick={() => onListItemClick(data.pinRespDto, index)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={()=>mouseLeaveList(index)}
            
        >
          <div className="gap-3">
            <div className="flex gap-3">
              <div className="flex">
                <h5 className="mb-2 text-lg font-bold tracking-tight">
                  {data.bookRespDto?.title}
                </h5>
                <Image
                  src={data.private ? Private : unLock}
                  alt="private"
                  style={{ width: '25px', height: '25px' }}
                />
              </div>

              <Link
                href={`/detail/${data.bookRespDto && data.bookRespDto.isbn ? data.bookRespDto.isbn.replace(' ', '') : ''}`}
              >
                <Image
                  src={isHovered ? linkArrow : blackLinkArrow}
                  alt="linkArrow"
                  className="absolute right-10"
                  width={16}
                  height={10}
                />
              </Link>
              </div>
              <div className='mb-2'>
            <div className="flex align-center ">
              <Image
                src={isHovered ? hoverPrivateMarker : privateMarker}
                alt="hoverPrivateMarker"
                className=""
              />
              <h5 className=" text-sm font-bold tracking-tight">
                {data.pinRespDto.name
                  ? data.pinRespDto.name
                  : data.pinRespDto.address}
              </h5>
            </div>
                <p className="text-xs text-gray-600">{data.pinRespDto.address}</p>
                </div>
          </div>
          <p
            className={`font-normal ${iscontentExpanded ? 'whitespace-pre-line' : 'line-clamp-2'}`}
          >
            {data.content}
          </p>
        </div>
      )}
    </div>
  )
}

export default ListItem
