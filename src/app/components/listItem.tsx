'use client'

import { mapState } from '@/store/mapAtoms'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'

interface listItemProps {
  data: any
  onListItemClick: (place: any, i: number) => void
  index: number
  isShared: boolean
}

const ListItem = ({
  data,
  onListItemClick,
  index,
  isShared,
}: listItemProps) => {
  const [recoilMap] = useRecoilState<any>(mapState)
  const [isHovered, setIsHovered] = useState(false)
  const [iscontentExpanded, setIsContentExpanded] = useState(false);

  const toggleContentExpanded = () => {
    setIsContentExpanded(!iscontentExpanded);
  }

  return (
    <div>
      {isShared ? (
        <div
          className={`relative text-left left-5 block max-w-xs p-6 my-2 border border-gray-200 rounded-lg shadow z-50${
            isHovered
              ? 'hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              : ''
          }`}
          onClick={() => onListItemClick(data.place, index)}
          style={{background:'#c5c5c5'}}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 ">
            {data.place.place_name ? data.place.place_name : data.place.address}
          </h5>
          {data && data.tags.map((tag: any, i: number) => (
            tag.selected && <div>{tag.name}</div>
            ))}

        </div>
      ) : (
        <div
          className={`relative text-left left-5 block max-w-xs p-6 my-2 bg-white border border-gray-200 rounded-lg shadow z-50 ${
            isHovered
              ? 'hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              : ''
          }`}
          onClick={() => onListItemClick(data.place, index)}
          style={{background:'#c5c5c5'}}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 ">
            {data.place.place_name ? data.place.place_name : data.place.address}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {data.content}
          </p>
        </div>
      )}
    </div>
  )
}

export default ListItem
