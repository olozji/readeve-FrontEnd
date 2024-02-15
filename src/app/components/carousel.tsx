import React, { useState } from 'react';
import { slideData } from '../assets/data/bookdummy';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Link from 'next/link';

const SlideCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChange = (index:any) => {
    setCurrentIndex(index);
  };

  const slidesToShow = 3; // 한 번에 표시할 슬라이드 개수

  const renderSlides = () => {
    const slides = [];

    for (let i = 0; i < slideData.length; i += slidesToShow) {
      const chunk = slideData.slice(i, i + slidesToShow);
      slides.push(
        <div key={i} className="flex space-x-4">
          {chunk.map((image, index) => (
            <div
              key={index}
              className="w-80 h-80 border border-slate-200 bg-slate-200 relative"
            >
              <img src={image.src} className="h-full" />
              <div className="absolute transform -translate-y-1/2 md:left-20 top-1/2 mx-8">
                <div className="text-white text-left">
                  <h1 className="text-3xl md:text-5xl font-bold">{image.title}</h1>
                  <p className="py-4 md:text-2xl">{image.content}</p>
                  <button className="btn">
                    <Link href="/">바로가기 &#8594;</Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return slides;
  };

  return (
    <div className="mx-5 my-5">
      <Carousel
        showArrows={true}
        autoPlay={false}
        infiniteLoop={true}
        showThumbs={false}
        selectedItem={currentIndex}
        onChange={handleChange}
      >
        {renderSlides()}
      </Carousel>
    </div>
  );
};

export default SlideCarousel;
