/*global kakao */

import React, { useEffect, useState } from 'react'
import MapSearch from './mapSearch'
import searchIcon from 'public/images/searchIcon.png'
import Image from 'next/image'
import { MapDirectSearch } from './mapDirectSearch'
import CustomModal from '../components/modal'
import markerImage from '/public/images/marker1.png'
import markerImageOpacity from '/public/images/marker2.png'
import mapSearchIcon from '/public/images/mapSearchIcon.png'

interface AddPlaceProps {
  onClose: () => void
  onMarkerClickParent: (markerInfo: string) => void
  selectedPlace: string
}

const AddPlace: React.FC<AddPlaceProps> = ({
  onClose,
  onMarkerClickParent,
  selectedPlace,
}) => {
  const [InputText, setInputText] = useState('') // 추가할 장소이름 검색
  const [Place, setPlace] = useState('') // 추가할 장소 데이터 설정
  const [directSearch, setDirectSearch] = useState(false) // 초기 상태는 검색창으로 검색
  const [placeName, setPlaceName] = useState<string>('')

  const onChange = (e: any) => {
    setInputText(e.target.value)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
    onMarkerClickParent(InputText)
  }

  const changeSearchType = (e: any) => {
    e.preventDefault()
    setDirectSearch(!directSearch)
  }

  // 마커의 장소를 받아오기 위한 함수
  const onMarkerClick = (placeName: string) => {
    setPlaceName(placeName)
    setInputText(placeName)
    onMarkerClickParent(placeName) // 이 부분을 추가
    console.log(placeName)
  }

  const handleCloseModal = () => {
    onClose() // 부모 컴포넌트에서 전달받은 onClose 함수 호출
  }

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      setPlaceName(placeName) // 선택된 장소 정보를 반영
      setInputText('')
      onMarkerClickParent(placeName) // 선택된 장소 정보를 Editor 컴포넌트로 전달
    }
    onClose() // 모달 닫기
  }

  return (
    <div className="bg-white py-8 px-16 rounded-lg">
      <div className="pt-8 pb-4 flex gap-x-8 text-[#9f9f9f] border-b-2 font-semibold">
        <button
          onClick={() => setDirectSearch(false)}
          className={`${!directSearch && 'text-[#e57C65]'}`}
        >
          검색창으로 장소 검색
        </button>
        <button
          onClick={() => setDirectSearch(true)}
          className={`${directSearch && 'text-[#e57C65]'}`}
        >
          지도에서 직접 선택
        </button>
      </div>
      {directSearch ? (
        <div>
          <MapDirectSearch
            onMarkerClick={onMarkerClick}
            selectedPlace={selectedPlace}
            markerImage={markerImage}
          />
        </div>
      ) : (
        <div>
          <div className="pt-4 text-3xl font-extrabold">
            장소를 검색해주세요
          </div>
          <form className="py-5">
            <div className="flex items-center gap-4">
              <div className="searchInputDiv">
                <input
                  type="text"
                  size={50}
                  placeholder="장소명, 도로명, 지번, 건물명 검색"
                  className="w-[35rem] h-[2.5rem] px-3 border border-black rounded-2xl bg-white"
                  onChange={onChange}
                  value={InputText}
                />
              </div>
              <div className="bg-[#E57C65] border-4 border-white px-2 py-1 rounded-3xl shadow-xl justify-center">
                <button id="searchBtn" onClick={handleSubmit}>
                  <Image
                    src={mapSearchIcon}
                    alt="mapSearchIcon"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </form>
          <MapSearch
            mapHeight={'40vh'}
            searchPlace={Place}
            onMarkerClick={onMarkerClick}
            markerImage={markerImage}
            markerImageOpacity={markerImageOpacity}
          />
        </div>
      )}
    </div>
  )
}

export default AddPlace
