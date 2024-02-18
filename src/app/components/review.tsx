import React, { useState } from 'react';
import { slideData } from '../assets/data/bookdummy';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { allReviewSelector } from '@/store/writeAtoms';

const Review = () => {

  const allReviews = useRecoilValue(allReviewSelector);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChange = (index:any) => {
    setCurrentIndex(index);
  };

  const mainReviewToShow = 6; // 메인화면에서 보여질 갯수

  const mainReviews = Array.isArray(allReviews) ? allReviews.slice(0, mainReviewToShow) : [];

 
  return (
        <div className="">
          <div className='flex justify-between'>
          <span>모든 기록</span>
          <span>
            <Link href={'/reviews'}>
            더 보기
            </Link>
            </span>
          </div>
          {mainReviews.map((review:any, index:any) => (
            <div key={index} className="reviewItem w-80 h-80 border border-slate-200 bg-slate-200 relative">
              <div className="absolute transform -translate-y-1/2 md:left-20 top-1/2 mx-8">
                <div className="text-white text-left">
                  <h1 className="text-3xl md:text-5xl font-bold">{review.title}</h1>
                  <p className="py-4 md:text-2xl">{review.content}</p>
                  <div>책 이미지</div>
                </div>
              </div>
            </div>
            ))}
        </div>
  );
};

export default Review;
