/*global kakao */
import React, { useEffect, useState } from 'react'
import MapSearch from './mapSearch'
import searchIcon from 'public/images/searchIcon.png'
import Image from 'next/image'
import { MapDirectSearch } from './mapDirectSearch'
import CustomModal from '../components/modal'


interface AddPlaceProps {
  onClose: () => void;
}

const AddPlace : React.FC<AddPlaceProps> = ({ onClose }) => {


  const [InputText, setInputText] = useState('') // 추가할 장소이름 검색
  const [Place, setPlace] = useState('') // 추가할 장소 데이터 설정
  const [directSearch, setDirectSerach] = useState(false) //초기 상태는 검색창으로 검색
  const [placeName, setPlaceName] = useState<string>('');

  const onChange = (e: any) => {
    setInputText(e.target.value)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')

    
  }

  const changeSearchType = (e:any) => {
    e.preventDefault();
    setDirectSerach(!directSearch);
  }

  // 마커의 장소를 받아오기 위한 함수
  const onMarkerClick = (placeName: string) => {
    setPlaceName(placeName)
    setInputText(placeName)
    console.log(placeName);
  };


  const handleCloseModal = () => {
    setDirectSerach(false);
  };

  return (
    
    <CustomModal isOpen={true} onClose={onClose}>
      <div className="bg-white p-8 rounded-lg">
          <button
            onClick={changeSearchType}>
              {directSearch? `직접 핀으로 검색`:`이름으로 검색`}
          </button>
      {directSearch ? (
        <div>
          <MapDirectSearch></MapDirectSearch>
        </div>
      ) : (
        <div>
          <form className="inputForm">
            <div className="addSearchDiv">
              <div className="searchInputDiv">
                <input
                  type="text"
                  size={50}
                  defaultValue=""
                  placeholder="장소를 검색하세요"
                  onChange={onChange}
                  value={InputText}

                />
                {/* <Image id="searchIcon" onClick={handleSubmit} src={searchIcon} alt='search'/> */}
              </div>
              <div className="buttonDiv">
                {/* <button type="submit" style={{ display: 'none' }}>
                  enterKey시 검색할 수 있는 형식상 submit 버튼
                </button> */}
                <button id="searchBtn" onClick={handleSubmit}>
                  검색
                </button>
              </div>
            </div>
          </form>
          <MapSearch searchPlace={Place} onMarkerClick={onMarkerClick} />
        </div>
      )}
      {/* <MapSearch searchPlace={Place} /> */}

      {/*검색한 값을 props로 MapSearch 컴포넌트로 보냄*/}
      {/* <MapDirectSearch></MapDirectSearch> */}
      </div>  
    </CustomModal>
      
  )
}
// AddPlaceMap 컴포넌트에 이름으로 검색한 장소 데이터 전달
export default AddPlace
