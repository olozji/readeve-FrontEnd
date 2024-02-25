'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRecoilState, useRecoilValue } from 'recoil';
import { allDataState, bookState, filterReviewState, getReviewData, reviewState, selectedReviewState } from '@/store/writeAtoms';

export interface ReviewData {
    [x: string]: any;
    id?:number;
    date?:string;
    title?:string;
    place?:string;
    category?:string;
    description?:string;
    isFavorite?:boolean;
    image?:string;
    tag?: {
        rate?: number;
        count?: number;
      };
    private?:boolean;
    book?: {
      isbn: string;
      title: string;
      thumbnail: string;
      content: string;
      isPrivate: boolean;
  };
}

const ReviewPage = () => {

    const [categoryName, setCategoryName] = useState('');
    const [publicReviews, setPublicReviews] = useState<ReviewData[]>([]);
    const allReviews = useRecoilValue(getReviewData)
    const reviewItems = allReviews.filter((item:ReviewData) => item.category === "reviews");
  
    const [selectedReview, setSelectedReview] = useRecoilState(selectedReviewState);
    const [reviewFilter, setReviewFilter] = useRecoilState(filterReviewState);
    const [bookInfo] = useRecoilState<any>(bookState)
    const [allDataInfo,setAllDataInfo] = useRecoilState<any>(allDataState)
   
    const filteredReviews = reviewItems.filter((item: ReviewData) => {
        if (reviewFilter === '전체') {
          return true; // 전체 범위 선택 시 모든 리뷰 반환
        }
    });
   

    useEffect(() => {
      const storedData = localStorage.getItem('allDataInfo');
    
      if (storedData) {
        const parsedData: ReviewData[] = JSON.parse(storedData);
        const PublicReviewData = parsedData.filter((item: ReviewData) => !item.isPrivate);
        console.log(PublicReviewData);
        setPublicReviews(PublicReviewData);
      }
    }, []);

 
  return (
        <section className="main mx-auto max-w-6xl px-4">
          <section className='pt-20 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto'>
            <h2 className='mb-5 lg:mb-8 text-3xl lg:text-4xl text-center font-bold'>
                {categoryName}
            </h2>
            <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                <a href="#" className="inline-flex items-center text-sm font-medium">
                    <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    홈
                </a>
            </li>
            <li>
      <div className="flex items-center">
        <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
        <a href="#" className="ml-1 text-sm font-medium">모든 공유기록 보기</a>
      </div>
    </li>
  </ol>
</nav>
    <div className='lg-pt-10 md-pt-10 relative'>
        <div className='absolute left-0'>
    <div className="flex py-4 md:py-8">
        <div id="filter" className=" flex gap-3 text-gray-900 text-sm rounded-lg w-full p-2.5">
        <div>최신등록순</div>
        <div>오래된순</div>
        <div>즐겨찾기순</div>
    </div>
    </div>
    </div>
        </div> 
    <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-1 lg:pt-20'>
    {publicReviews.length === 0 ? (
  <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
    <section className='pt-16'>
      <div className="pt-4 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
        <h1 className='text-4xl'>등록된 리뷰가 없습니다</h1>
      </div>
    </section>
  </div>
) : (
  <div className='grid gap-6 md:grid-cols-3 lg:grid-cols-3 lg:pt-20 md:pt-20'>
    {publicReviews.map((item: ReviewData) => (
      <Link href={`/review/${item.id}`} key={item.id} onClick={() => setSelectedReview(item)}>
        <div className="relative w-90 h-80 border rounded-md border-slate-200">
            <div className="mb-4 h-full w-full border-4 rounded-md">
              <img src={item.book?.thumbnail} alt={item.title} className="h-full w-full object-fill rounded-md" />       
            </div>
          </div>
      </Link>
    ))}
  </div>
)}
    </div>
        </section>
        </section>
  );
};

export default ReviewPage;
