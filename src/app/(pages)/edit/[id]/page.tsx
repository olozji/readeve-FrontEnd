'use client'

import { BookSearch } from '@/app/components/bookSearch'
import AddPlace from '@/app/components/map'
import CustomModal from '@/app/components/modal'
import { Tag } from '@/app/components/tags';
import { bookState, tagState, titleState } from '@/store/writeAtoms'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

const Editor = () => {
  const [content, setContent] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('')
  const [InputText, setInputText] = useState('')
  const [titleInfo, setTitleInfo] = useRecoilState(titleState);
  const [bookInfo] = useRecoilState<any>(bookState)
  const [tagInfo] = useRecoilState<any>(tagState);
  const [isPrivate,setIsPrivate] = useState(false)


  const handleSearchMap = useCallback((e: any) => {
    e.preventDefault()
    setShowMap(true)
  }, [])

  const handleCloseMap = useCallback(() => {
    setShowMap(false)
  }, [])

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      setSelectedPlace(selectedPlace)
      setInputText(selectedPlace)
      onMarkerClickParent(selectedPlace)
      console.log('사용자가 선택한 장소:', selectedPlace)
    }
    handleCloseMap()
  }

  const onMarkerClickParent = (markerInfo: string) => {
    setInputText(markerInfo)
  }
  const handleTitle = (e: any) => {
    e.preventDefault();
    setTitleInfo(e.target.value)
  }

  return (
    <div className="flex justify-center mx-auto box-border min-h-full">
      <div className="w-full px-5 py-10 sm:px-10 md:px-20 lg:px-40 xl:px-80 border border-slate-400 rounded-md">
        <header className="h-10">
          <h1>기록하기</h1>
        </header>
              <section className="py-8 flex gap-10 border border-slate-400 rounded-t-md">
              <h4 className="px-5">제목</h4>
          <div className="input_box">
            <input
              className="border-slate-400 rounded-md bg-slate-200"
              value={titleInfo}
              onChange={handleTitle}
            />
          </div>
        </section>
        <section className="py-8 flex gap-10 border border-slate-400">
          <h4 className="px-5">where</h4>
          <div className="input_box w-full">
            <input
              className="border-slate-400 rounded-md bg-slate-200"
              value={selectedPlace}
              onClick={handleSearchMap}
            />
            {showMap && (
              <CustomModal isOpen={true} onClose={handleCloseMap}>
                <AddPlace
                  onClose={handleCloseMap}
                  onMarkerClickParent={setSelectedPlace}
                  selectedPlace={selectedPlace}
                />
                <div className="mt-4 text-center">
                  <p>선택된 장소: {selectedPlace}</p>
                  <p>선택된 장소가 맞습니까?</p>
                  <button
                    onClick={() => handleConfirmation(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    예
                  </button>
                  <button
                    onClick={() => handleConfirmation(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    아니오
                  </button>
                </div>
              </CustomModal>
            )}
          </div>
        </section>
        <section className="py-8 flex gap-10 border border-slate-400">
          <h4 className="px-5">Book</h4>
          <div>
            {bookInfo.title && (
                          <div className='justify-items-center' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div>현재 선택된 책</div>
                <img
                  src={bookInfo.thumbnail ? bookInfo.thumbnail: 'http://via.placeholder.com/120X150'}
                  alt="책 표지"
                  className="mb-2 rounded"
                />
                <div className="p-4">{bookInfo.title}</div>
              </div>
            )}
            <BookSearch></BookSearch>
          </div>
        </section>
        <section className="py-8 flex border border-slate-400 gap-3">
                  <h4 className="px-5">tag</h4>
                  
                  <Tag></Tag>
                  {tagInfo.length!=0 && <div className='flex gap-4'>
                      {tagInfo.map((ele:any,i:number) => {
                          if (ele.selected) {
                              return <div key={i}>{ele.name}</div>
                      }
                  })}
                  </div>}
        </section>
        <section className="py-8 flex border border-b-0 border-slate-400 gap-3">
          <div className="tag_name flex mx-auto gap-5">
          </div>
        </section>
        <section className="py-8 border border-t-0 border-slate-400 rounded-b-md">
          <div className="px-5 py-8">
            <textarea
              className="border border-slate-200 rounded-md w-full h-80 bg-slate-200"
              placeholder="오늘 나의 독서는..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="control_btn flex gap-5">
            <button className="bg-red-300 rounded-md">취소하기</button>
            <button className="bg-indigo-400 rounded-md">작성완료</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Editor
function onMarkerClickParent(InputText: string) {
  throw new Error('Function not implemented.')
}

