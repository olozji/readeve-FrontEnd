'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import prevArrow from '/public/images/prevArrow.png'
import Image from 'next/image';

export const GoBackButton = () => {
  const router = useRouter()

  useEffect(() => {
    const handleGoBack = () => {
      router.back()
    }
const gobackbtn =document.getElementById('gobackBtn')
    gobackbtn!.addEventListener('click', handleGoBack) // 이벤트 리스너 추가

    return () => {
      gobackbtn!.removeEventListener('click', handleGoBack) // 이벤트 리스너 제거
    }
  }, [router])

    return <button id='gobackBtn' className='absolute top-2 left-2 z-30'>
        <Image src={prevArrow} alt='뒤로가기'/>
        </button>;
}
