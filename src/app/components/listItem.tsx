'use client';

import { mapState } from '@/store/mapAtoms';
import Link from 'next/link';
import React, { useState } from 'react'
import { useRecoilState } from 'recoil';

interface listItemProps {
  data: any
  onListItemClick: (place: any, i: number) => void;
  index:number
}

const ListItem = ({ data, onListItemClick,index }: listItemProps) => {
  
  const [recoilMap] = useRecoilState<any>(mapState)
  const [isHovered, setIsHovered] = useState(false);
  

  
  return (
    <div
    className={`relative left-5 top-5 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow z-50 ${
      isHovered ? 'hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700' : ''
    }`}
    onClick={() => onListItemClick(data.place,index)}
  >
    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      {data.place.place_name ? data.place.place_name : data.place.address}
    </h5>
    <p className="font-normal text-gray-700 dark:text-gray-400">{data.content}</p>
  </div>
  )
}

export default ListItem
