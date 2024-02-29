'use client'
import Button from '@/app/components/buttons/button'
import CustomModal from '@/app/components/modal'
import { bookState, editReivewState, removeReivewState } from '@/store/writeAtoms';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';

import Private from '/public/images/private.png';
import unLock from '/public/images/unLock.png';
import lampIcon from '/public/images/lampicon.png';

export interface PropType {
  params: {
    id: string;
    searchParams: {}
  }
}

const BookLayoutItem = (props: any) => {
  const [bookData, setBookData] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState<boolean[]>([false,false,false]);

  // TODO: 수정 삭제도 리코일로 관리할지? 논의 해봐용
  const [editReviewId, setEditReviewId] = useRecoilState(editReivewState)
  const [removeReviewId, setRemoveReviewId] = useRecoilState(removeReivewState)

  
  let session: any = useSession()
  const router = useRouter();

  function isBook(element: any) {
    if (element.book && element.book.isbn) {
      let bookId = element.book.isbn.replace(' ', '')
      if (bookId === props.id) {
        return true
      }
    }
  }

  const handleModal = (idx:number) => {
     let copy = [];
      for(let i = 0; i < detailOpen.length; i++){
        if(i == idx){
        copy.push(!detailOpen[i]) 
        } else {
          copy.push(detailOpen[i])
        }
      }
      setDetailOpen(copy)
     
    
  }


  // 독후감 삭제 TODO: API 아직 몰라서 로컬에서 삭제되는 부분으로 처리 했어요 나중에 로직을 바꿔야 할듯
  // 수정은 edit에서 구현되어 있는 것 같아서 냅뒀어요! 
  const handleRemove = (isbn: string) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const storedData = localStorage.getItem("allDataInfo");
  
      if (storedData) {
        const parsedData: any[] = JSON.parse(storedData);
  
        // isbn을 통해 독후감을 삭제
        const updatedData = parsedData.filter((item) => !isBook(item));
        localStorage.setItem("allDataInfo", JSON.stringify(updatedData));
  
        setBookData(updatedData);

        router.push(`/mypage/${session.data?.user.id}` );
      }
    }
  };

   // 선택된 독후감의 저자 정보 가져오기
   const selectedReviewAuthors = bookData && bookData[0]?.book?.authors;
    
   // 하나의 저자를 선택해서 출력 (첫 번째 저자 선택)
   const firstAuthor = selectedReviewAuthors && selectedReviewAuthors[0];

   // 모든 저자를 합쳐서 출력
   const allAuthors = selectedReviewAuthors && selectedReviewAuthors.join(', ');

   console.log('선택된 독후감의 첫 번째 저자:', firstAuthor);
   console.log('선택된 독후감의 모든 저자:', allAuthors);
  

  useEffect(() => {
    const storedData = localStorage.getItem('allDataInfo')
    let arr: boolean[] = [];

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      let result = parsedData.filter(isBook)
      console.log(result)
      setBookData(result)
      result.forEach(() => {arr.push(false)})
      setDetailOpen(arr)
    }
  }, [props.id, removeReviewId])
  console.log(bookData)

  

  return (
    <div className='bg-[#F1E5CF] mx-auto'>
        <div className='mx-auto justify-center text-center'>
        <Image
          src={lampIcon.src}
          className='inline-block text-center'
          alt={lampIcon.src}
          width={200}
          height={100}
        />
        <div>
        <h1 className='myCustomText'>내 서재</h1>
        </div>
      </div>
      {bookData && bookData[0] && (
        <div
          className={`mx-auto w-[80rem] max-w-[80rem] text-center p-4 border border-b-black`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={
              bookData[0].book.thumbnail
                ? bookData[0].book.thumbnail
                : 'http://via.placeholder.com/120X150'
            }
            alt="책 표지"
            className="mb-2 rounded"
          />
        <div className="p-4 text-xl font-display font-bold">
          {bookData[0].book.title} | {selectedReviewAuthors} 작가</div>
        </div>
      )}
      <>
        <section className="main">
          <section className="pt-20 lg:pt-5 pb-4 lg:pb-8 px-4 xl:px-2 xl:container mx-auto">
            <div className="md-pt-10 relative">
                <div className='lg-pt-10 md-pt-10 relative'>
                  <div className='absolute left-0'>
              <div className="flex py-4 md:py-8">
                  <div id="filter" className=" flex gap-3 text-gray-900 text-sm rounded-lg w-full p-2.5">
                  <div>최신등록순</div>                  
                  <div>오래된순</div>
                      </div>
                      </div>
                      </div>
                  </div> 
                </div>
            {bookData &&
              bookData.map((data: any, i: number) => ( 
          <div
            key={i} 
            onClick={() => {handleModal(i)}}
            className="max-w-3xl my-4 mx-auto bg-slate-200 bg-opacity-80 rounded-lg overflow-hidden shadow-lg p-8">
            {detailOpen && 
              <CustomModal isOpen={detailOpen[i]}>
                <div className='h-[50rem]'>
                  <div className='px-8 py-8'>
                  <div className='flex'>
                  <img
                  src={
                    bookData[0].book.thumbnail
                      ? bookData[0].book.thumbnail
                      : 'http://via.placeholder.com/120X150'
                    }
                    alt="책 표지"
                    className="w-[14rem] mb-2 rounded object-fll"
                  />
                  <div>
                  <h1 className='text-lg font-extrabold'>{data.title}</h1>
                  <Image
                    src={data.isPrivate ? Private : unLock}
                    alt="private"
                    style={{ width: '25px', height: '25px' }}
                    />
                  <div className='flex gap-4'>
                    <span>where</span>
                   <div>{data.place.place_name}</div>
                    </div>
                    <div className='flex gap-4'>
                    <span>when</span>
                   <div>{data.place.place_name}</div>
                    </div>
                    <div className='flex gap-4'>
                    <span>tags</span>
                    {data.tags.map((data:any) => (
                        data.selected && <div>{data.name}</div>
                          )
                    )}
                    </div>
                  </div>
                </div>
                <div className='flex relative left-[35rem] w-[10rem] gap-4'>
                    <Link href={'/edit/1'}><Button label='수정' outline={true}/></Link>
                    <Button label='삭제' outline={false} onClick={() => handleRemove(data.isbn)}/>
                  </div>
                <div className='h-[30rem] border border-slate-200 rounded-md bg-slate-200'>
                  {data.content}
                  </div>
                </div>
              </div>
              </CustomModal>}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                <Image
                src={data.isPrivate ? Private : unLock}
                alt="private"
                style={{ width: '25px', height: '25px' }}
                />
                <div className="">
                  <h1>
                    독서한 장소:{' '}
                    {data.place.place_name
                      ? data.place.place_name
                      : data.place.address}
                  </h1>
                  <h1>{data.place.address}</h1>
          </div>
            <p className="text-lg">{data.content}</p>
          </div>
        </div>
              ))} 
          </section>
        </section>
      </>
    </div>
  )
}

export default BookLayoutItem
