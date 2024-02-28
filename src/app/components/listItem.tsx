'use client'

import { mapState } from '@/store/mapAtoms'
import Link from 'next/link'
import React, { useState } from 'react'
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
  onListItemClick: (place: any, i: number) => void
  index: number
  isShared: boolean
  selectedMarkerIndex:string;
}

const ListItem = ({
  data,
  onListItemClick,
  index,
  isShared,
  selectedMarkerIndex,
}: listItemProps) => {
  const [recoilMap] = useRecoilState<any>(mapState)
  const [isHovered, setIsHovered] = useState(false)
  const [iscontentExpanded, setIsContentExpanded] = useState(false);
  const [isSeeMoreVisible, setIsSeeMoreVisible] = useState(true);

  const toggleContentExpanded = () => {
    setIsContentExpanded(!iscontentExpanded);
  }

  return (
    <div className='opacity-100'>
      {isShared ? (
        <div
          className={`relative text-left left-5 block p-6 my-2 
          border border-gray-200 rounded-lg shadow z-50 hover:bg-[#E57C65] hover:text-white  ${selectedMarkerIndex === data.place.id ? 'bg-[#E57C65]' : 'bg-white'}`}
          onClick={() => onListItemClick(data.place, index)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
             {isHovered ? (
              <Link href={`/detail/${data.book && data.book.isbn ? data.book.isbn.replace(' ', '') : ''}`}>
               <Image
               src={linkArrow}
               alt='linkArrow'
               className='absolute right-10'
               width={16}
               height={10}
             />
             </Link>
            ) : (
              <Link href={`/detail/${data.book && data.book.isbn ? data.book.isbn.replace(' ', '') : ''}`}>
            <Image
              src={blackLinkArrow}
              alt='linkArrow'
              className='absolute right-10'
              width={16}
              height={10}
            />
            </Link>
            )}
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            {data.place.place_name ? data.place.place_name : data.place.address}
          </h5>
          
          {isHovered ? (
                <Image
                src={hoverPrivateMarker}
                alt='hoverPrivateMarker'
                className='absolute left-2'
                width={16}
                height={10}
              />
            ) : (
              <Image
              src={privateMarker}
              alt='privateMarker'
              className='absolute left-2'
              width={16}
              height={10}
              />
            )}
          <p>{data.place.address}</p>
          {data && data.tags.map((tag: any, i: number) => (
            tag.selected &&
              <div
              className={`box-border flex justify-center items-center px-4 py-2 my-2 mx-2 border border-gray-300 rounded-full 
              ${tag.selected ?
                'bg-white text-black' : 'bg-[#E57C65] hover:border-[#C05555] hover:text-[#C05555]'}`}
                >
                  {tag.name}
                  </div>
            ))}
        </div>
      ) : (
        <div
          className="relative text-left left-5 block p-6 my-2
            border bg-white border-gray-200 rounded-lg shadow z-50 hover:bg-[#E57C65] hover:text-white"
           onClick={() => onListItemClick(data.place, index)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >  
          <div className='gap-3'>
          <div className='flex gap-3'>
            <div className='flex'>
          <h5 className='mb-2 text-lg font-bold tracking-tight'>{data.book?.title}</h5>
          {data.isPrivate ? (
             <Image 
             src={Private}
             alt='private' 
             style={{ width:'25px', height:'25px'}}
             />
          ) : (
            <Image 
            src={unLock} 
            alt='private' 
            style={{ width:'25px', height:'25px'}}
            />
          )}
            </div>
            {isHovered ? (
              <Link href={`/detail/${data.book && data.book.isbn ? data.book.isbn.replace(' ', '') : ''}`}>
               <Image
               src={linkArrow}
               alt='linkArrow'
               className='absolute right-10'
               width={16}
               height={10}
             />
             </Link>
            ) : (
              <Link href={`/detail/${data.book && data.book.isbn ? data.book.isbn.replace(' ', '') : ''}`}>
            <Image
              src={blackLinkArrow}
              alt='linkArrow'
              className='absolute right-10'
              width={16}
              height={10}
            />
            </Link>
            )}
          </div>
          <div className='flex gap-3'>
            {isHovered ? (
                <Image
                src={hoverPrivateMarker}
                alt='hoverPrivateMarker'
                className='absolute left-2'
                width={16}
                height={10}
              />
            ) : (
              <Image
              src={privateMarker}
              alt='privateMarker'
              className='absolute left-2'
              width={16}
              height={10}
              />
            )}
          <h5 className="mb-2 text-sm font-bold tracking-tight">
            {data.place.place_name ? data.place.place_name : data.place.address}
          </h5>
          <p className='text-sm'>{data.place.address}</p>
          </div>
            </div>
          <p className={`font-normal ${iscontentExpanded ? 'whitespace-pre-line' : 'line-clamp-2'}`}>
            {data.content}
          </p>
           
        </div>
      )}
    </div>
  )
}

export default ListItem
